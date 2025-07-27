import { createSlice } from "@reduxjs/toolkit";
import {
  checkAuth,
  fetchUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassOtpVerify,
  resetPassWord,
  resetPasswordOtp,
} from "./authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    otpLoading: false,
    error: null,
    otpSent: false,
    otpVerified: false,
    otpMessage: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOtpSent: (state) => {
      state.otpSent = false;
      state.otpMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Reset Password OTP
      .addCase(resetPasswordOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(resetPasswordOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpSent = true;
        state.otpMessage = action.payload?.message;
      })
      .addCase(resetPasswordOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.otpSent = false;
      })

      .addCase(resetPassOtpVerify.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(resetPassOtpVerify.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpVerified = true;
      })
      .addCase(resetPassOtpVerify.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload || "OTP verification failed";
      })

      .addCase(resetPassWord.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(resetPassWord.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(resetPassWord.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload || "Password reset failed";
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearOtpSent } = authSlice.actions;
export default authSlice.reducer;
