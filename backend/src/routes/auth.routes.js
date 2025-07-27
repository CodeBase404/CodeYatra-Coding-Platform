const express = require("express");
const {
  userRegister,
  adminRegister,
  login,
  logout,
  profile,
  checkValidUser,
  sendVerifyOtp,
  verifyEmail,
  sendResetPasswordOTP,
  resetPassword,
  verifyResetPassOtp,
  getAllUsers,
  updatePassword,
  updateProfile,
  deleteAccount,
} = require("../controllers/auth.controller");
const {
  userAuthMiddleware,
  adminAuthMiddleware,
} = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/admin/register", adminAuthMiddleware, adminRegister);
authRouter.post("/login", login);
authRouter.get("/logout", userAuthMiddleware, logout);
authRouter.get("/profile", userAuthMiddleware, profile);
authRouter.get("/check", userAuthMiddleware, checkValidUser);
authRouter.get("/sent-verify-otp", userAuthMiddleware, sendVerifyOtp);
authRouter.get("/all-users", adminAuthMiddleware, getAllUsers);
authRouter.post("/verify-account", userAuthMiddleware, verifyEmail);
authRouter.post("/reset-password-otp", sendResetPasswordOTP);
authRouter.post("/verify-reset-pass-otp", verifyResetPassOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/update-password", userAuthMiddleware, updatePassword);
authRouter.put("/update-profile", userAuthMiddleware, updateProfile);
authRouter.delete('/delete-account', userAuthMiddleware, deleteAccount);

module.exports = authRouter;
