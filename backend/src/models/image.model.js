const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
    },
    secureUrl: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    format: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SolutionImage = mongoose.model("solutionImage", imageSchema);

module.exports = SolutionImage;
