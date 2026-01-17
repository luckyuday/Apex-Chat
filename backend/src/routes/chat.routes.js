const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const router = express.Router();
const { createChat } = require("../controllers/chat.controller");
router.post("/", authUser, createChat);

module.exports = router;
