import { createSlice } from "@reduxjs/toolkit";
import { markDailyChallengeSolved } from "./dailyChallengeThunk";

const dailyChallengeSlice = createSlice({
  name: "dailyChallenge",
  initialState: {
    loading: false,
    error: null,
    solvedToday: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(markDailyChallengeSolved.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markDailyChallengeSolved.fulfilled, (state) => {
        state.loading = false;
        state.solvedToday = true;
      })
      .addCase(markDailyChallengeSolved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dailyChallengeSlice.reducer;