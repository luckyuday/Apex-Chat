const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;
  const isUserExists = await userModel.findOne({ email: email });

  if (isUserExists) {
    return res.status(401).json({
      message: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);

  res
    .status(201)
    .json({ message: "User registered Successfully.", email: user.email });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);
  res.status(201).json({
    email: user.email,
    message: "User logged in Successfully.",
  });
};

module.exports = { registerUser, loginUser };
