const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
