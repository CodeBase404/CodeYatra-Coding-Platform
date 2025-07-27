const express = require("express");
const videoRouter = express.Router();
const {
  generateVideoUploadSignature,
  saveVideoSolutionMetadata,
  deleteVideoSolution,
  getAllVideoSolution
} = require("../controllers/video.controller");
const { adminAuthMiddleware } = require("../middlewares/auth.middleware");

videoRouter.get("/upload/:problemId", adminAuthMiddleware, generateVideoUploadSignature);
videoRouter.post("/save", adminAuthMiddleware, saveVideoSolutionMetadata);
videoRouter.get("/allVideoSolutions", adminAuthMiddleware, getAllVideoSolution);
videoRouter.delete("/:problemId", adminAuthMiddleware, deleteVideoSolution);

module.exports = videoRouter;
