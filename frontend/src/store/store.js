import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "../features/auth/authSlice";
import problemsReducer from "../features/problem/problemsSlice";
import uiReducer from "../features/ui/uiSlice";
import contestsReducer from "../features/contest/contestSlice";
import dailyChallengeReducer from "../features/dailyChallenge/dailyChallengeSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "user"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  problems: problemsReducer,
  ui: uiReducer,
  contests: contestsReducer,
  dailyChallenge: dailyChallengeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);