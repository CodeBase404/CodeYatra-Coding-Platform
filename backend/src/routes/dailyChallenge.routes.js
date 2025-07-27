const express = require("express");
const dailyChallengeRouter = express.Router();
const {
  getDailyChallenge,
  markDailyChallengeSolved,
} = require("../controllers/dailyChallenge.controller");
const { userAuthMiddleware } = require("../middlewares/auth.middleware");

dailyChallengeRouter.get("/", userAuthMiddleware, getDailyChallenge);
dailyChallengeRouter.post(
  "/mark-solved",
  userAuthMiddleware,
  markDailyChallengeSolved
);

module.exports = dailyChallengeRouter;
