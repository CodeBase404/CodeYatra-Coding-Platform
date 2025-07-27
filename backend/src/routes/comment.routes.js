const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth.middleware.js");
const { getComments, createComment, voteComment, addReply } = require("../controllers/comment.controller.js");

const commentRouter = express.Router();

commentRouter.get("/:problemId",userAuthMiddleware, getComments);
commentRouter.post("/:id/reply",userAuthMiddleware, addReply);
commentRouter.post("/:problemId",userAuthMiddleware, createComment);
commentRouter.post("/:id/vote", userAuthMiddleware, voteComment);


module.exports = commentRouter;
