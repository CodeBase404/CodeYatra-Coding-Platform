import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProblems,
  fetchSolvedProblems,
  fetchSubmissionsById,
  getProblemById,
  submitProblemById,
  runProblemById,
  getAllSubmissions,
  getAllVideoSolution,
  fetchLastSubmission,
  fetchFavorites,
} from "./problemThunks";

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    problems: [],
    solvedProblems: [],
    problem: [],
    submissions: [],
    solutionSubmit: [],
    solutionRun: [],
    allSubmission: [],
    solutionVideos: [],
    lastSubmission: [],
    favProblems: [],
    loadings: {
      run: false,
      submit: false,
    },
    loading: false,
    error: null,
  },
  reducers: {
    deleteProblemFromStore: (state, action) => {
      const idToDelete = action.payload;
      state.problems = state.problems.filter((p) => p._id !== idToDelete);
    },
    setRunLoading: (state, action) => {
      state.loadings.run = action.payload;
    },
    setSubmitLoading: (state, action) => {
      state.loadings.submit = action.payload;
    },
    removeFavoriteLocally: (state, action) => {
      state.favProblems = state.favProblems.filter(
        (problem) => problem._id !== action.payload
      );
    },
    addFavoriteLocally: (state, action) => {
  const problem = action.payload;
  if (!state.favProblems.some((p) => p._id === problem._id)) {
    state.favProblems.unshift(problem);
  }
}
  },
  extraReducers: (builder) => {
    builder
      // All Problems
      .addCase(fetchAllProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(fetchAllProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Solved Problems
      .addCase(fetchSolvedProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolvedProblems.fulfilled, (state, action) => {
        state.solvedProblems = action.payload;
      })
      .addCase(fetchSolvedProblems.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Submission Problems
      .addCase(fetchSubmissionsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubmissionsById.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissionsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Problem by id
      .addCase(getProblemById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.problem = action.payload;
      })
      .addCase(getProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit the Solution of Problem by id
      .addCase(submitProblemById.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.solutionSubmit = action.payload;
      })
      .addCase(submitProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Run the Solution of Problem by id
      .addCase(runProblemById.pending, (state) => {
        state.loading = true;
      })
      .addCase(runProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.solutionRun = action.payload;
      })
      .addCase(runProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get All Submission
      .addCase(getAllSubmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.allSubmission = action.payload;
      })
      .addCase(getAllSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get All Solution Videos
      .addCase(getAllVideoSolution.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVideoSolution.fulfilled, (state, action) => {
        state.loading = false;
        state.solutionVideos = action.payload;
      })
      .addCase(getAllVideoSolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get Last submission Solution Videos
      .addCase(fetchLastSubmission.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLastSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSubmission = action.payload;
      })
      .addCase(fetchLastSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // get favorite Problems
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favProblems = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { deleteProblemFromStore, setRunLoading, setSubmitLoading, removeFavoriteLocally, addFavoriteLocally } =
  problemsSlice.actions;
export default problemsSlice.reducer;
