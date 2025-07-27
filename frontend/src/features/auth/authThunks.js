import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      return response.data.user;
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      return response.data.user;
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/user/check");
      return data.user;
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.get("/user/logout");
      return null;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const resetPasswordOtp = createAsyncThunk(
  "auth/resetPassOtp",
  async (emailId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/reset-password-otp", {
        emailId,
      });
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      console.log("sonu", message);

      return rejectWithValue(message);
    }
  }
);

export const resetPassOtpVerify = createAsyncThunk(
  "auth/resetPassOtpVerify",
  async ({ emailId, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/verify-reset-pass-otp", {
        emailId,
        otp,
      });
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      console.log(error);
      
      return rejectWithValue(message);
    }
  }
);

export const resetPassWord = createAsyncThunk(
  "auth/resetPassword",
  async ({ emailId, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/reset-password", {
        emailId,
        newPassword,
      });

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/user/profile");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const deleteAccount = () => async (dispatch) => {
  try {
    const res = await axiosClient.delete("/user/delete-account");
    alert(res.data.message || "Account deleted successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete account");
  }
};
