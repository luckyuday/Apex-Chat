const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const {
  generateResponse,
  createEmbedding,
} = require("../services/gemini.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/pinecone.service");
function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173"],
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
      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication Error: Invalid token provided"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("Socket created: ", socket.id);
    socket.on("aiMessage", async (messagepayload) => {
      try {
        const message = await messageModel.create({
          chat: messagepayload.chat,
          user: socket.user._id,
          content: messagepayload.content,
          role: "user",
        });
        socket.emit("aiResponse", message);
        let [vectors, chatHistory] = await Promise.all([
          createEmbedding(messagepayload.content),
          messageModel
            .find({
              chat: messagepayload.chat,
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
          parts: [{ text: messagepayload.content }],
        });

        const response = await generateResponse(memory);

        const [responseVectors, responseMessage] = await Promise.all([
          createEmbedding(response),
          messageModel.create({
            chat: messagepayload.chat,
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
            chat: messagepayload.chat,
            user: socket.user._id,
            text: messagepayload.content,
          },
        });
        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            user: socket.user._id,
            chat: messagepayload.chat,
            text: response,
          },
        });
      } catch (err) {
        socket.emit("aiResponse", {
          user: socket.user._id,
          createdAt: new Date().toISOString(),
          role: "model",
          content: "Error generating response",
          chat: messagepayload.chat,
        });
      }
    });
  });
}

module.exports = initSocketServer;
