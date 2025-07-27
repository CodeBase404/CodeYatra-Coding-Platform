const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "cpp", "java"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "wrong answer", "error"],
      default: "pending",
    },
    runtime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      type: Number,
      default: 0,
    },
    contestId: {
      type: Schema.Types.ObjectId,
      ref: "contest",
      required: false,
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("submission", submissionSchema);
module.exports = Submission;
