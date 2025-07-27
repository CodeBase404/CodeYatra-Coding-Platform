import { createSlice } from "@reduxjs/toolkit";
import { fetchAllContests, fetchContestProblemsById } from "./contestThunks";

const contestSlice = createSlice({
  name: "contests",
  initialState: {
    contests: [],
    contestProblems: [],
    leaderboardProblems: {},
    data: [],
    leaderboard: {},
    loading: false,
    error: null,
  },
  reducers: {
    deleteContestFromStore: (state, action) => {
      const idToDelete = action.payload;
      state.contests = state.contests.filter((p) => p._id !== idToDelete);
    },
    addContestToStore(state, action) {
      state.contests.unshift(action.payload);
    },
    setLeaderboard(state, action) {
      const { contestId, data, leaderboardProblems } = action.payload;
      state.leaderboard[contestId] = data;
      if (leaderboardProblems?.length > 0) {
        state.leaderboardProblems[contestId] = leaderboardProblems;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // All Contests
      .addCase(fetchAllContests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload;
      })
      .addCase(fetchAllContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Contest Problems by contest Id
      .addCase(fetchContestProblemsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContestProblemsById.fulfilled, (state, action) => {
        state.loading = false;
        state.contestProblems = action.payload;
      })
      .addCase(fetchContestProblemsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { deleteContestFromStore, addContestToStore, setLeaderboard } =
  contestSlice.actions;
export default contestSlice.reducer;
