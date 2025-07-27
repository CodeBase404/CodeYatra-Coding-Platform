const SolutionImage = require("../models/image.model");
const Problem = require("../models/problem.model");
const User = require("../models/user.model");
const SolutionVideo = require("../models/video.model");
const validateReferenceSolutions = require("../utils/validateReferenceSolutions");

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    await validateReferenceSolutions(referenceSolution, visibleTestCases);

    await Problem.create({
      ...req.body,
      problemCreator: req.user._id,
    });

    res.status(201).json({ message: "Problem Saved Successfully" });
  } catch (error) {
    res.status(400).json({ message: "error while creating problem" });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing problem ID" });
    }

    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    await validateReferenceSolutions(referenceSolution, visibleTestCases);

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
        problemCreator,
      },
      { runValidators: true, new: true }
    );

    res.status(200).json({
      message: "Problem updated successfully",
      data: updatedProblem,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params || req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing problem ID" });
    }

    const problem = await Problem.findByIdAndDelete(id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing problem ID" });
    }

    const problem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution"
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const videos = await SolutionVideo.findOne({ problemId: id });
    const image = await SolutionImage.findOne({ problemId: id });

    if (videos && image) {
      const problemWithMedia = {
        ...problem.toObject(),
        secureUrl: videos.secureUrl,
        thumbnailUrl: videos.thumbnailUrl,
        duration: videos.duration,
        imageUrl: image.secureUrl,
        imageFormat: image.format || "",
      };
      return res.status(200).json({ problem: problemWithMedia });
    }

    if (videos) {
      const problemWithVideo = {
        ...problem.toObject(),
        secureUrl: videos.secureUrl,
        thumbnailUrl: videos.thumbnailUrl,
        duration: videos.duration,
      };

      return res.status(200).json({ problem: problemWithVideo });
    }

    if (image) {
      const problemWithImage = {
        ...problem.toObject(),
        imageUrl: image.secureUrl,
        imageFormat: image.format || "",
      };
      return res.status(200).json({ problem: problemWithImage });
    }

    res.status(200).json({ problem });
  } catch (error) {
    console.error("Get problem error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAllProblem = async (req, res) => {
  try {
    const allProblems = await Problem.find({}).select(
      "_id title tags difficulty description createdAt"
    );

    if (allProblems.length === 0) {
      return res.status(404).json({ message: "No problems found" });
    }
    res.status(200).json({ problems: allProblems });
  } catch (error) {
    console.error("Get all problems error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAllSolvedProblemByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title tags difficulty",
    });
    res.status(200).send(user.problemSolved);
  } catch (error) {
    res.status(500).send("Error while fetching all solved problem");
  }
};

const likeUnlikeProblem = async (req, res) => {
  const problemId = req.params.id;
  const userId = req.user._id;

  const problem = await Problem.findById(problemId);

  const io = req.app.get("io");

  if (!problem) return res.status(404).json({ message: "Problem not found" });

  // Logic to like/unlike
  const alreadyLiked = problem.likes.includes(userId);
  if (alreadyLiked) {
    problem.likes.pull(userId);
  } else {
    problem.likes.push(userId);
  }

  await problem.save();

  io.to(problemId.toString()).emit("problem:likeUpdate", {
    problemId: problemId.toString(),
    likes: problem.likes.length,
  });

  res.json({
    liked: !alreadyLiked,
    likes: problem.likes.length,
  });
};

const getLikes = async (req, res) => {
  const problemId = req.params.id;
  const userId = req.user._id; 

  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ message: "Not found" });

  const liked = problem.likes.includes(userId); 

  res.json({
    likes: problem.likes.length,
    liked, 
  });
};

const toggleFavoriteProblem = async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isFavorite = user.favorites.includes(problemId);

  if (isFavorite) {
    user.favorites = user.favorites.filter((id) => id.toString() !== problemId);
  } else {
    user.favorites.push(problemId);
  }

  await user.save();

  res.json({
    message: isFavorite ? "Removed from favorites" : "Added to favorites",
  });
};

const getAllFavoriteProblem = async (req, res) => {
  const userId = req.user._id;

 const user = await User.findById(userId).populate({
    path: "favorites",
    select: "title difficulty tags likes",
  });
  console.log(user.favorites);
  
  

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.favorites);
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblem,
  getAllProblem,
  getAllSolvedProblemByUser,
  likeUnlikeProblem,
  getLikes,
  toggleFavoriteProblem,
  getAllFavoriteProblem,
};
