const express = require("express");
const imageRouter = express.Router();

const { adminAuthMiddleware, userAuthMiddleware } = require("../middlewares/auth.middleware");
const {
  generateThumbnailSignature,
  saveImageSolutionMetadata,
  generateProfileImageSignature,
  saveUserProfileImage,
} = require("../controllers/image.controller");

imageRouter.get(
  "/upload/:problemId",
  adminAuthMiddleware,
  generateThumbnailSignature
);
imageRouter.post("/save", adminAuthMiddleware, saveImageSolutionMetadata);
imageRouter.get(
  "/profile/upload",
  userAuthMiddleware,
  generateProfileImageSignature
);
imageRouter.post("/profile/save", userAuthMiddleware, saveUserProfileImage);

module.exports = imageRouter;