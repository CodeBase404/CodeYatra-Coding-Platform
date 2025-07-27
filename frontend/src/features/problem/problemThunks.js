import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

export const fetchAllProblems = createAsyncThunk(
  "problems/fetchProblems",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/problem");
      return data.problems || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch problems");
    }
  }
);

export const fetchSolvedProblems = createAsyncThunk(
  "problems/fetchSolvedProblems",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/problem/solvedProblem");

      return data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch solved problems");
    }
  }
);

export const fetchSubmissionsById = createAsyncThunk(
  "problems/fetchSubmissionsById",
  async (problemId, thunkAPI) => {
    try {
      const { data } = await axiosClient.get(`/submission/${problemId}`);
      return data.submission || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch submission of problem");
    }
  }
);

export const getProblemById = createAsyncThunk(
  "problems/getProblemById",
  async (problemId, thunkAPI) => {
    try {
      const { data } = await axiosClient.get(`/problem/${problemId}`);

      return data.problem || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch problem");
    }
  }
);

export const submitProblemById = createAsyncThunk(
  "problems/submitProblemById",
  async ({ code, language, contestId, problemId }, thunkAPI) => {
    try {
      const { data } = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code,
          language,
          contestId,
        }
      );

      return data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to Submit the Submission");
    }
  }
);

export const runProblemById = createAsyncThunk(
  "problems/runProblemById",
  async ({ code, language, problemId }, thunkAPI) => {
    try {
      const { data } = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language,
      });

      return data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to Submit the Submission");
    }
  }
);

export const getAllSubmissions = createAsyncThunk(
  "problems/getAllSubmissions",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/submission");

      return data.submission || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch All the Submission");
    }
  }
);

export const getAllVideoSolution = createAsyncThunk(
  "problems/getAllVideoSolution",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/video/allVideoSolutions");
      return data?.videos || [];
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return thunkAPI.rejectWithValue(err.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Something went wrong while fetching videos."
      );
    }
  }
);

export const fetchLastSubmission = createAsyncThunk(
  "problems/fetchLastSubmission",
  async ({ problemId, language }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        `/submission/last/${problemId}/${language}`
      );
      return res?.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  "problems/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/problem/favorites");
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching favorites");
    }
  }
);
