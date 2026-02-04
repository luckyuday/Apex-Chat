const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { getUser } = require("../controllers/user.controller");
const router = express();
router.get("/", authUser, getUser);

module.exports = router;
