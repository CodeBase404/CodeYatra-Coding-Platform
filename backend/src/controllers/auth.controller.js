const rediClient = require("../configs/redis");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateUserInput = require("../utils/validator");
const transporter = require("../configs/nodemailer");
const crypto = require("crypto");
const checkAndDeactivatePremium = require("../utils/checkAndDeactivatePremium");
const Submission = require("../models/submission.model");

const register = async (req, res, role = "user") => {
  try {
    validateUserInput(req.body);

    const { emailId, password } = req.body;
    const existingUser = await User.exists({ emailId });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      role,
      password: hashPassword,
    });

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: emailId,
      subject: "Welcome to LeetCode",
      text: `Welcome to LeetCode,
       Your account has been created successfullly`,
    };

    await transporter.sendMail(mailOptions);

    const {
      _id,
      firstName,
      emailId: email,
      role: roles,
      dailyChallengeHistory,
    } = user;

    res.status(200).json({
      user: { _id, firstName, email, roles, dailyChallengeHistory },
      message: `${roles} registered successfully`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const userRegister = (req, res) => register(req, res, "user");

const adminRegister = (req, res) => register(req, res, "admin");

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    const {
      _id,
      firstName,
      emailId: email,
      role,
      dailyChallengeHistory,
      createdAt,
      updatedAt,
      profileImage,
      isAccountVerified,
      premiumPlan,
    } = user;

    res.status(200).json({
      user: {
        _id,
        firstName,
        email,
        role,
        dailyChallengeHistory,
        createdAt,
        updatedAt,
        profileImage,
        isAccountVerified,
        premiumPlan,
      },
      message: `${role} login successfully`,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await rediClient.set(`token:${token}`, "Blocked");
    await rediClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", null, {
      httpOnly: true, // helps prevent XSS attacks
      expires: new Date(Date.now()), // expires the cookie immediately
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -emailVerification -passwordReset");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await checkAndDeactivatePremium(user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { firstName } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = firstName || user.firstName;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkValidUser = async (req, res) => {
  const { _id, firstName, emailId, role, dailyChallengeHistory } = req.user;

  res.status(200).json({
    user: { _id, firstName, emailId, role, dailyChallengeHistory },
    message: "Valid User",
  });
};

const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log(user);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAccountVerified) {
      return res.json({ message: "Account already verified" });
    }

    const lastSent = user.emailVerification?.sentAt;
    if (lastSent && new Date() - lastSent < 1 * 60 * 1000) {
      return res
        .status(429)
        .json({ message: "OTP already sent. Please wait." });
    }

    const otp = String(crypto.randomInt(100000, 999999));
    user.emailVerification = {
      otp,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
      sentAt: new Date(),
      verified: false,
    };

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.emailId,
      subject: "Account Verification OTP",
      html: `<div style="font-family:sans-serif">
        <h2>🔐 Verify your account</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 3px;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: `Verification OTP sent on ${user.emailId}` });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user._id;

  if (!userId || !otp) {
    return res.json({ message: "Missing Details" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const emailData = user.emailVerification;

    if (!emailData?.otp || emailData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (emailData.expireAt < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.emailVerification = {
      otp: null,
      expireAt: null,
      sentAt: null,
      verified: true,
    };

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendResetPasswordOTP = async (req, res) => {
  const { emailId } = req.body;
  if (!emailId) {
    return res.status(400).json({ message: "Email is Required" });
  }

  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lastSent = user.passwordReset?.sentAt;
    if (lastSent && new Date() - lastSent < 1 * 60 * 1000) {
      return res
        .status(429)
        .json({ message: "OTP already sent. Please wait." });
    }

    const otp = String(crypto.randomInt(100000, 999999));

    user.passwordReset = {
      otp,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
      sentAt: new Date(),
      verified: false,
    };

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.emailId,
      subject: `${otp} is your password reset code`,
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
      <h2 style="color: #333;">🔐 Password Reset Request</h2>
      <p>Hi <strong>${user.firstName}</strong>,</p>
      <p>We received your request to reset your password.</p>
      <p style="margin-top: 20px; font-size: 18px;">
        <strong>Your OTP is:</strong>
      </p>
      <p style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #2c3e50; margin: 10px 0;">
        ${otp}
      </p>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p style="margin-top: 30px;">Thanks,<br />Team Support</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `OTP sent to your email` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyResetPassOtp = async (req, res) => {
  const { emailId, otp } = req.body;
  if (!emailId || !otp) {
    return res.status(400).json({ message: "Missing field" });
  }

  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetData = user.passwordReset;

    if (!resetData?.otp || resetData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > resetData.expireAt) {
      user.passwordReset.verified = false;
      return res.status(400).json({ message: "OTP Expired" });
    }

    user.passwordReset.verified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { emailId, newPassword } = req.body;
  console.log(emailId, newPassword);

  if (!emailId || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const user = await User.findOne({ emailId });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.passwordReset?.verified) {
      return res.status(401).json({ message: "OTP not verified" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordReset = {
      otp: null,
      expireAt: null,
      sentAt: null,
      verified: false,
    };

    await user.save();

    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both old and new passwords are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("firstName emailId");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await Submission.deleteMany({ userId });
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ message: "Server error. Could not delete account." });
  }
};


module.exports = {
  userRegister,
  adminRegister,
  login,
  logout,
  profile,
  checkValidUser,
  sendVerifyOtp,
  verifyEmail,
  sendResetPasswordOTP,
  verifyResetPassOtp,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  deleteAccount,
};
