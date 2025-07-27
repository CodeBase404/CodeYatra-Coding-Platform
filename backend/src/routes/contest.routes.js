const express = require("express");
const contestRouter = express.Router();
const {
  createContest,
  getAllContests,
  getContestProblems,
  deleteContest,
  registerUser,
  getContestLeaderboard,
  deregisterContest,
} = require("../controllers/contest.controller");
const {
  adminAuthMiddleware,
  userAuthMiddleware,
} = require("../middlewares/auth.middleware");

contestRouter.post("/create", adminAuthMiddleware, createContest);
contestRouter.delete("/:contestId", adminAuthMiddleware, deleteContest);
contestRouter.post("/:contestId/register", userAuthMiddleware, registerUser);
contestRouter.post("/:contestId/deregister", userAuthMiddleware, deregisterContest);
contestRouter.get("/", userAuthMiddleware, getAllContests);
contestRouter.get("/:contestId/problems",userAuthMiddleware, getContestProblems);
contestRouter.get("/:contestId/leaderboard", getContestLeaderboard);

module.exports = contestRouter;
