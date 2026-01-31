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
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    if (!cookies.token) {
      return next(new Error("Authentication Error: No Token Provided"));
    }
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id, "-password");
      socket.user = user;
      console.log(socket.user);
      next();
    } catch (error) {
      next(new Error("Authentication Error: Invalid token provided"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("Socket created: ", socket.id);
    socket.on("ai-message", async (messagepayload) => {
      console.log(messagepayload.content);
      let [vectors, message, chatHistory] = await Promise.all([
        createEmbedding(messagepayload.content),
        messageModel.create({
          chat: messagepayload.chat,
          user: socket.user._id,
          content: messagepayload.content,
          role: "user",
        }),
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
            text: `This is the query returned from vector database. Use it to answer.Also don't mention anything about backend.\n ${query
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

      //Case when memory is empty then current text is provided in memory
      if (memory.length == 0) {
        memory.push({
          role: "user",
          parts: [{ text: messagepayload.content }],
        });
      }

      const response = await generateResponse(memory);
      socket.emit("ai-response", {
        content: response,
        chat: messagepayload.chat,
      });
      const [responseVectors, responseMessage] = await Promise.all([
        createEmbedding(response),
        messageModel.create({
          chat: messagepayload.chat,
          user: socket.user._id,
          content: response,
          role: "model",
        }),
      ]);
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
    });
  });
}

module.exports = initSocketServer;
