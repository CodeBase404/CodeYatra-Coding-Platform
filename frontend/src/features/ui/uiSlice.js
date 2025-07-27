import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    selectedTab: "description",
    adminSelectedTab: "dashboard",
    resultTab: null,
    selected: "testCases",
    theme: localStorage.getItem("theme") || "light",
    showPassword: false,
    isMobileOpen: false,
    isCollapsed: false,
    showCreateModal:false,
    showAll:false,
  },
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setAdminSelectedTab: (state, action) => {
      state.adminSelectedTab = action.payload;
    },
    setResultTab: (state, action) => {
      state.resultTab = action.payload;
      state.selectedTab = action.payload;
    },
    clearResultTab: (state) => {
      if (state.selectedTab === state.resultTab) {
        state.selectedTab = "description";
      }
      state.resultTab = null;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    setShowPassword: (state, action) => {
      state.showPassword = action.payload;
    },
    setIsMobileOpen: (state, action) => {
      state.isMobileOpen = action.payload;
    },
    setIsCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
    setShowCreateModal: (state, action) => {
      state.showCreateModal = action.payload;
    },
    setShowAll: (state, action) => {
      state.showCreateModal = action.payload;
    },
  },
});

export const {
  setSelectedTab,
  setResultTab,
  clearResultTab,
  setSelected,
  setAdminSelectedTab,
  toggleTheme,
  setTheme,
  setShowPassword,
  setIsMobileOpen,
  setIsCollapsed,
  setShowCreateModal,
  setShowAll,
} = uiSlice.actions;
export default uiSlice.reducer;
