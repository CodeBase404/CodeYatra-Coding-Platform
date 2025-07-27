const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  razorpay_payment_id: String,
  razorpay_order_id: String,
  amount: Number,
  status: {
    type: String,
    enum: ["captured", "failed", "refunded"],
    default: "captured",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const premiumPlanSchema = new Schema({
  type: {
    type: String,
    enum: ["none", "monthly", "yearly"],
    default: "none",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  startDate: Date,
  endDate: Date,
  isUsed: {
    type: Boolean,
    default: false,
  },
});

const otpSchema = new Schema({
  otp: String,
  expireAt: Date,
  sentAt: Date,
  verified: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: {
      publicId: String,
      secureUrl: String,
    },
    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
        },
      ],
      unique: true,
    },
    dailyChallengeHistory: [
      {
        date: String,
        problemId: mongoose.Schema.Types.ObjectId,
        solved: Boolean,
      },
    ],
    premiumPlan: premiumPlanSchema,
    paymentHistory: [paymentSchema],
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    emailVerification: otpSchema,
    passwordReset: otpSchema,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "problem" }],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
