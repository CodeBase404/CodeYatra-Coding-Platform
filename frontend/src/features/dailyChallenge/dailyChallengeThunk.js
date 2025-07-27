import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

export const markDailyChallengeSolved = createAsyncThunk(
  "dailyChallenge/markSolved",
  async (problemId) => {
    const res = await axiosClient.post("/daily-challenge/mark-solved", { problemId });
    return res.data;
  }
);