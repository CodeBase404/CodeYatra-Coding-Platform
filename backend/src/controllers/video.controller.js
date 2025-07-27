const cloudinary = require("cloudinary").v2;
const Problem = require("../models/problem.model");
const SolutionVideo = require("../models/video.model");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateVideoUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;

    const userId = req.user._id;
    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `codeYatra-solutions/${problemId}/${userId}_${timestamp}`;

    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Failed to generate upload credentials" });
  }
};

const saveVideoSolutionMetadata = async (req, res) => {
  try {
    const { problemId, cloudinaryPublicId, secureUrl, duration } = req.body;

    const userId = req.user._id;

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: "video" }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: "Video not found on Cloudinary" });
    }

    // Check if video already exists for this problem and user
    const existingVideo = await SolutionVideo.findOne({
      problemId,
      userId,
      cloudinaryPublicId,
    });

    if (existingVideo) {
      return res.status(409).json({ error: "Video already exists" });
    }

    const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
      resource_type: "video",
      transformation: [
        { width: 400, height: 225, crop: "fill" },
        { quality: "auto" },
        { start_offset: "auto" },
      ],
      format: "jpg",
    });

    // const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id, {
    //   resource_type: "video",
    // });

    const videoSolution = await SolutionVideo.create({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      thumbnailUrl,
      duration: cloudinaryResource.duration || duration,
    });

    res.status(201).json({
      message: "Video solution saved successfully",
      videoSolution: {
        id: videoSolution._id,
        secureUrl: videoSolution.secureUrl,
        thumbnailUrl: videoSolution.thumbnailUrl,
        duration: videoSolution.duration,
        uploadedAt: videoSolution.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saving video metadata:", error);
    res.status(500).json({ error: "Failed to save video metadata" });
  }
};

const getAllVideoSolution = async (req, res) => {
  try {
    const videos = await SolutionVideo.find({})
      .populate({
        path: "problemId",
        select: "title difficulty tags",
      })
      .select("_id problemId secureUrl thumbnailUrl duration createdAt");

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos found" });
    }

    res.status(200).json({ videos });
  } catch (error) {
    console.error("Get all videos error:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deleteVideoSolution = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const video = await SolutionVideo.findOneAndDelete({
      problemId,
      userId,
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    try {
      await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
        resource_type: "video",
        invalidate: true,
      });
    } catch (cloudErr) {
      console.error("Cloudinary deletion error:", cloudErr.message);
    }

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
};

module.exports = {
  generateVideoUploadSignature,
  saveVideoSolutionMetadata,
  deleteVideoSolution,
  getAllVideoSolution,
};
