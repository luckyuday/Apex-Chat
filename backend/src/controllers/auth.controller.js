const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    fullName: { firstName, lastName } = {},
    email: rawEmail,
    password,
  } = req.body || {};
  if (!firstName || !lastName || !rawEmail || !password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }
  const email = String(rawEmail).trim().toLowerCase();
  const isUserExists = await userModel.findOne({ email });

  if (isUserExists) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json({ message: "User registered Successfully.", email: user.email });
};

const loginUser = async (req, res) => {
  const { email: rawEmail, password } = req.body || {};
  if (!rawEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const email = String(rawEmail).trim().toLowerCase();
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    email: user.email,
    message: "User logged in Successfully.",
  });
};

const logoutUser = async (_, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
  });
  res.status(200).json({
    message: "User logged out successfully",
  });
};

module.exports = { registerUser, loginUser, logoutUser };
