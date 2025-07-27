const mongoose = require("mongoose");
const Comment = require("../models/comment.model");

// Utility to check valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all comments for a problem
const getComments = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!problemId || !isValidObjectId(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing Problem ID",
      });
    }

    const comments = await Comment.find({ problemId })
      .populate("userId", "firstName profileImage")
        .populate("replies.userId", "firstName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST a new comment
const createComment = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    // Validate inputs
    if (!problemId || !isValidObjectId(problemId)) {
      return res.status(400).json({ success: false, message: "Invalid Problem ID" });
    }

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({ success: false, message: "Unauthorized or invalid user" });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length > 1000) {
      return res.status(400).json({ success: false, message: "Comment is too long (max 1000 chars)" });
    }

    const newComment = new Comment({
      problemId,
      userId,
      content: trimmedContent,
    });

    await newComment.save();

    const populatedComment = await newComment.populate("userId", "firstName");

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addReply = async (req, res) => {
  try {
    const { id } = req.params; // comment ID
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const reply = {
      userId: req.user._id,
      content: req.body.content,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    const updated = await comment.populate("replies.userId", "firstName");
    res.json(updated.replies.at(-1)); // return latest reply
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const voteComment = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "upvote" or "downvote"
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.upvotes.pull(userId);
    comment.downvotes.pull(userId);

    if (action === "upvote") comment.upvotes.push(userId);
    if (action === "downvote") comment.downvotes.push(userId);

    await comment.save();
    res.json({
      upvotes: comment.upvotes.length,
      downvotes: comment.downvotes.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = {
  getComments,
  createComment,
  addReply,
  voteComment
};
