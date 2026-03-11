const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");

async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

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
  console.log(chat);
  await chatModel.findByIdAndDelete({ _id: chat._id });
  await messageModel.deleteMany({ chat: chat._id });
  res.status(200).json({
    message: "Chat Deleted successfully",
  });
}

async function getChats(req, res) {
  const user = req.user;
  const chats = await chatModel.find({ user }).select("title lastActivity");
  res.status(200).json(chats);
}

module.exports = { createChat, getChats, deleteChat };
