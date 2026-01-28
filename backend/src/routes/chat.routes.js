const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const router = express.Router();
const { createChat, getChats } = require("../controllers/chat.controller");
router.post("/", authUser, createChat);
router.get("/", authUser, getChats);

module.exports = router;
