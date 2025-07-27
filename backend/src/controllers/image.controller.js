const cloudinary = require("cloudinary").v2;
const SolutionImage = require("../models/image.model");
const Problem = require("../models/problem.model");
const User = require("../models/user.model");
const SolutionVideo = require("../models/video.model");
const { sanitizeFilter } = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const generateThumbnailSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `video-thumbnails/${problemId}/${userId}_${timestamp}`;

    const uploadParams = {
      timestamp,
      public_id: publicId,
    };

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
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    });
  } catch (error) {
    console.error("Error generating thumbnail signature:", error);
    res.status(500).json({ error: "Failed to generate thumbnail signature" });
  }
};

const saveImageSolutionMetadata = async (req, res) => {
  try {
    const { problemId, cloudinaryPublicId, secureUrl } = req.body;
    const userId = req.user._id;

    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      {
        resource_type: "image",
      }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: "Image not found on Cloudinary" });
    }

    const existingImage = await SolutionImage.findOne({
      problemId,
      userId,
      cloudinaryPublicId,
    });

    if (existingImage) {
      return res.status(409).json({ error: "Image already exists" });
    }

    const imageSolution = await SolutionImage.create({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      width: cloudinaryResource.width,
      height: cloudinaryResource.height,
      format: cloudinaryResource.format,
    });

    res.status(201).json({
      message: "Image solution saved successfully",
      imageSolution: {
        id: imageSolution._id,
        secureUrl: imageSolution.secureUrl,
        width: imageSolution.width,
        height: imageSolution.height,
        format: imageSolution.format,
        uploadedAt: imageSolution.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saving image metadata:", error);
    res.status(500).json({ error: "Failed to save image metadata" });
  }
};

const generateProfileImageSignature = async (req, res) => {
  try {
    const userId = req.user._id;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `user-profiles/${userId}/${timestamp}`;

    const uploadParams = {
      timestamp,
      public_id: publicId,
    };

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
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    });
  } catch (error) {
    console.error("Error generating profile image signature:", error);
    res
      .status(500)
      .json({ error: "Failed to generate profile image signature" });
  }
};

const saveUserProfileImage = async (req, res) => {
  try {
    const { cloudinaryPublicId, secureUrl } = req.body;    
    const userId = req.user._id;

    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: "image" }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: "Image not found on Cloudinary" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profileImage = {
      publicId: cloudinaryPublicId,
      secureUrl: secureUrl,
    };

    await user.save();

    res.status(200).json({
      message: "Profile image saved successfully",
      profileImage: {
        secureUrl: secureUrl,
        width: cloudinaryResource.width,
        height: cloudinaryResource.height,
        format: cloudinaryResource.format,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error saving profile image:", error);
    res.status(500).json({ error: "Failed to save profile image" });
  }
};

module.exports = {
  deleteVideoSolution,
  getAllVideoSolution,
  generateThumbnailSignature,
  saveImageSolutionMetadata,
  generateProfileImageSignature,
  saveUserProfileImage,
};
