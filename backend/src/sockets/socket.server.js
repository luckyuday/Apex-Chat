const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const {
  streamGenerateResponse,
  createEmbedding,
} = require("../services/gemini.service");
const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");
const { createMemory, queryMemory } = require("../services/pinecone.service");
function initSocketServer(httpServer) {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      // Mirror the REST CORS policy in app.js: exact origins plus
      // Render's preview subdomains, deny everything else.
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (origin.endsWith(".onrender.com")) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) {
      return next(new Error("Authentication Error: No Token Provided"));
    }
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id, "-password");
      if (!user) {
        return next(new Error("Authentication Error: User not found"));
      }
      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication Error: Invalid token provided"));
    }
  });

  // Per-socket rate limit: keep a single client from draining the
  // Gemini / Pinecone free-tier quotas.
  const SOCKET_LIMIT = { windowMs: 60 * 1000, max: 30 };
  const socketTimers = new Map();

  io.on("connection", async (socket) => {
    socket.on("disconnect", () => socketTimers.delete(socket.id));
    socket.on("aiMessage", async (messagepayload) => {
      const { chat: chatId, content } = messagepayload || {};
      const now = Date.now();
      let window = socketTimers.get(socket.id);
      if (!window || now > window.resetAt) {
        window = { resetAt: now + SOCKET_LIMIT.windowMs, count: 0 };
        socketTimers.set(socket.id, window);
      }
      window.count += 1;
      if (window.count > SOCKET_LIMIT.max) {
        return socket.emit("aiResponse", {
          chat: chatId,
          user: socket.user._id,
          createdAt: new Date().toISOString(),
          role: "model",
          content: "You're sending messages too fast. Please slow down.",
        });
      }
      try {
        const MAX_CONTENT = 4000;
        if (
          !chatId ||
          !content ||
          typeof content !== "string" ||
          content.trim() === "" ||
          content.length > MAX_CONTENT
        ) {
          return socket.emit("aiResponse", {
            chat: chatId,
            role: "model",
            content:
              content && content.length > MAX_CONTENT
                ? "Message is too long (4000 character limit)."
                : "Message content is invalid",
            user: socket.user._id,
            createdAt: new Date().toISOString(),
          });
        }

        const chat = await chatModel.findOne({
          _id: chatId,
          user: socket.user._id,
        });
        if (!chat) {
          return socket.emit("aiResponse", {
            chat: chatId,
            role: "model",
            content: "Invalid chat ID",
            user: socket.user._id,
            createdAt: new Date().toISOString(),
          });
        }
        chat.lastActivity = new Date();
        await chat.save();

        const message = await messageModel.create({
          chat: chatId,
          user: socket.user._id,
          content,
          role: "user",
        });
        socket.emit("aiResponse", message);
        let [vectors, chatHistory] = await Promise.all([
          createEmbedding(content),
          messageModel
            .find({
              chat: chatId,
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
        ]);

        chatHistory = chatHistory.reverse();
        const query = await queryMemory({
          vectors: vectors,
          limit: 3,
          filter: {
            user: socket.user._id.toString(),
          },
        });

        const memory = []; //Container that holds both short term and long term memory
        const stm = chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        });

        const ltm = {
          role: "user",
          parts: [
            {
              text: `This is the query returned from vector database. Use it to answer. Also don't mention anything about backend.\n ${query
                .map((item) => item.metadata.text)
                .join("\n")}`,
            },
          ],
        };
        if (query.length > 0) {
          memory.push(ltm);
        }
        if (stm.length > 0) {
          memory.push(...stm);
        }
        memory.push({
          role: "user",
          parts: [{ text: content }],
        });

        // Stream the reply: the UI gets text as it's generated, then a
        // final aiResponse event carries the persisted document so the
        // cache/dedup path is unchanged.
        const response = await streamGenerateResponse(memory, (delta) => {
          socket.emit("aiResponseChunk", { chat: chatId, delta });
        });

        const [responseVectors, responseMessage] = await Promise.all([
          createEmbedding(response),
          messageModel.create({
            chat: chatId,
            user: socket.user._id,
            content: response,
            role: "model",
          }),
        ]);
        socket.emit("aiResponse", responseMessage);
        await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: chatId,
            user: socket.user._id,
            text: content,
          },
        });
        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            user: socket.user._id,
            chat: chatId,
            text: response,
          },
        });
      } catch (err) {
        console.error("aiMessage error:", err);
        socket.emit("aiResponse", {
          user: socket.user._id,
          createdAt: new Date().toISOString(),
          role: "model",
          content: "Error generating response",
          chat: chatId,
        });
      }
    });
  });
}

module.exports = initSocketServer;
