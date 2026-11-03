const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorised Request",
    });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Invalid/expired token — genuinely unauthorised
    return res.status(401).json({ message: "Unauthorised Request" });
  }

  try {
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Unauthorised Request",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    // DB/infrastructure failure: surface it, don't masquerade as 401
    next(error);
  }
}

module.exports = { authUser };
