const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const path = require("path");

const app = express();

// Render sits behind a proxy: trust one hop so rate limiting sees client IPs
app.set("trust proxy", 1);

// Security headers (CSP, nosniff, frame-deny, etc.)
app.use(helmet());

// Request logging: compact in dev, combined in prod
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin requests and non-browser clients (no Origin header)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Render's custom domain and preview subdomains
      if (origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Generic API limiter: 300 reqs / 15 min per IP, stops the free tier from
// being abused into a bot proxy.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// Strict auth limiter: brute-force protection on login + register.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use("/api", apiLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// Health check for Render's auto-restart and the keepalive cron.
// A DB we can't reach means requests would fail anyway, so report 503
// instead of a false "all good" and let Render restart the service.
app.get("/health", (req, res) => {
  const dbReady = mongoose.connection.readyState === 1; // 1 = connected
  if (!dbReady) {
    return res.status(503).json({ ok: false, db: "disconnected" });
  }
  res.status(200).json({ ok: true });
});

// Unknown /api routes get a JSON 404, not the SPA fallback
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Global error handler: catches rejections from async controllers
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});
const distPath = path.resolve(__dirname, "../../frontend/dist");
console.log("Serving static files from:", distPath);
app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Error serving application");
    }
  });
});
module.exports = app;
