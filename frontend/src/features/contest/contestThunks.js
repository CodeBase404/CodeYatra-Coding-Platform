import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

export const fetchAllContests = createAsyncThunk(
  "contest/fetchAllContests",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/contest");
      return data.contests || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch contest");
    }
  }
);

export const fetchContestProblemsById = createAsyncThunk(
  "contest/fetchContestProblemsById",
  async (contestId, thunkAPI) => {    
    try {
      const { data } = await axiosClient.get(`/contest/${contestId}/problems`);
      return data.problems || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch contest");
    }
  }
);
