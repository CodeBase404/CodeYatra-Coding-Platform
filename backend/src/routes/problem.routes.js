const express = require("express");
const problemRouter = express.Router();
const {
  adminAuthMiddleware,
  userAuthMiddleware,
} = require("../middlewares/auth.middleware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblem,
  getAllProblem,
  getAllSolvedProblemByUser,
  getLikes,
  likeUnlikeProblem,
  toggleFavoriteProblem,
  getAllFavoriteProblem,
} = require("../controllers/problem.controller");

// Admin-only routes
problemRouter.put("/:id", adminAuthMiddleware, updateProblem);
problemRouter.delete("/:id", adminAuthMiddleware, deleteProblem);
problemRouter.post("/", adminAuthMiddleware, createProblem);

// Public/user routes
problemRouter.get(
  "/solvedProblem",
  userAuthMiddleware,
  getAllSolvedProblemByUser
);
problemRouter.get("/favorites", userAuthMiddleware, getAllFavoriteProblem);
problemRouter.get("/:id/likes", userAuthMiddleware, getLikes);
problemRouter.post("/:id/likes", userAuthMiddleware, likeUnlikeProblem);
problemRouter.post("/favorite/:id", userAuthMiddleware, toggleFavoriteProblem);
problemRouter.get("/:id", userAuthMiddleware, getProblem);
problemRouter.get("/", userAuthMiddleware, getAllProblem);

module.exports = problemRouter;
