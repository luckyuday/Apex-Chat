const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Fail fast on missing config: a half-configured deploy should never boot
// and serve requests against a broken service.
const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "PINECONE_API_KEY",
];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = require("./src/app");
const connectDb = require("./src/db/db");
const initSocketServer = require("./src/sockets/socket.server");
const httpServer = require("http").createServer(app);

connectDb();
initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// A stray unhandled rejection must not kill the (single-instance) process
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

// Graceful shutdown so Render's deploys don't kill in-flight requests
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down...`);
  httpServer.close(() => process.exit(0));
  // Safety net: force-exit if sockets refuse to drain
  setTimeout(() => process.exit(0), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
