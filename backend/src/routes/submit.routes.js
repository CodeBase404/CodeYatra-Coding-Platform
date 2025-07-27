const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth.middleware");
const {
  submitCode,
  runCode,
  getSubmissionsById,
  getAllSubmissions,
  getLastSubmission,
} = require("../controllers/userSubmission.controller");

const submitRouter = express.Router();

submitRouter.post("/submit/:id", userAuthMiddleware, submitCode);
submitRouter.post("/run/:id", userAuthMiddleware, runCode);
submitRouter.get("/:id", userAuthMiddleware, getSubmissionsById);
submitRouter.get("/", userAuthMiddleware, getAllSubmissions);
submitRouter.get("/last/:problemId/:language", userAuthMiddleware, getLastSubmission);

module.exports = submitRouter;
