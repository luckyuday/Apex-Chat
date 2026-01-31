const chatModel = require("../models/chat.model");

async function authMessage(req, res, next) {
  const { chat } = req.params;
  const userId = req.user;
  if (!chat) {
    return res.status(400).json({
      message: "Chat doesn't Exist",
    });
  }

  try {
    const verifiedChat = await chatModel.findOne({ _id: chat, user: userId });
    if (!verifiedChat) {
      return res.status(403).json({
        message: "Unauthorised Request",
      });
    }
    req.chat = verifiedChat;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authMessage };
