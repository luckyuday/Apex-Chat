const messageModel = require("../models/message.model");

async function getMessages(req, res) {
  try {
    const user = req.user;
    const chat = req.chat;
    const messages = await messageModel
      .find({ user, chat })
      .select("-__v -updatedAt");
    res.status(200).json(messages);
  } catch (err) {
    res.staus(500).json({
      message: "Something went wrong",
    });
  }
}

module.exports = { getMessages };
