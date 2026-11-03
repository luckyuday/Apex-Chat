const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const { deleteMemoriesByChat } = require("../services/pinecone.service");

async function createChat(req, res) {
  const { title } = req.body || {};
  const user = req.user;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Chat title is required",
    });
  }

  const chat = await chatModel.create({
    user: user._id,
    title,
  });

  res.status(201).json({
    message: "Chat created successfully",
    chat: {
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user,
    },
  });
}

async function deleteChat(req, res) {
  const chat = req.chat;
  await chatModel.deleteOne({ _id: chat._id });
  await messageModel.deleteMany({ chat: chat._id });
  // Best-effort: purge the chat's long-term memories too. A failure here
  // should not block the (already-successful) Mongo deletion.
  deleteMemoriesByChat(chat._id.toString()).catch((err) => {
    console.error("Failed to purge chat memories:", err.message);
  });
  res.status(200).json({
    message: "Chat Deleted successfully",
  });
}

async function getChats(req, res) {
  const user = req.user;
  const chats = await chatModel
    .find({ user })
    .select("title lastActivity")
    .sort({ lastActivity: -1 });
  res.status(200).json(chats);
}

module.exports = { createChat, getChats, deleteChat };
