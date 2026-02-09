const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { authMessage } = require("../middlewares/message.middleware");
const { getMessages } = require("../controllers/message.controller");
const router = express.Router();

router.get("/:chat", authUser, authMessage, getMessages);
module.exports = router;
