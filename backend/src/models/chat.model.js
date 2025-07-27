const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "model"], required: true },
  parts: [{ text: String }],
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, problemId: 1 }, { unique: true });

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
