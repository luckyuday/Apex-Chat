const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model", "system"],
      default: "user",
    },
  },
  { timestamps: true, versionKey: false },
);
// History fetches + socket short-term memory both filter by chat, ordered by time
messageSchema.index({ chat: 1, user: 1, createdAt: -1 });

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;
