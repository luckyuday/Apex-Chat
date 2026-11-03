const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Fail fast on a slow/dead Mongo instead of stalling: cold starts
      // and reconnects get 5s to connect, and in-flight queries drop
      // after 3s of buffering instead of hanging for the 10s default.
      serverSelectionTimeoutMS: 5000,
      bufferTimeoutMS: 3000,
    });
    console.log("Db is connected");
  } catch (error) {
    console.error("Error while connecting to Db:", error.message);
    // Never serve a database-less app: exit so the platform can restart
    process.exit(1);
  }
};
module.exports = connectDb;
