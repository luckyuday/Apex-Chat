const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const router = express.Router();
const {
  createChat,
  getChats,
  deleteChat,
} = require("../controllers/chat.controller");
const { authMessage } = require("../middlewares/message.middleware");
router.post("/", authUser, createChat);
router.get("/", authUser, getChats);
router.delete("/:chat", authUser, authMessage, deleteChat);
module.exports = router;
