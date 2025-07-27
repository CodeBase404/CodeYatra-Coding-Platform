import { Routes, Route, Navigate, useLocation } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/forgotPassword";
import { checkAuth } from "./features/auth/authThunks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import CodeEditor from "./pages/CodeEditor";
import ProblemSet from "./pages/ProblemSet";
import Navbar from "./components/ui/Navbar";
import Admin from "./pages/Admin";
import UploadVideo from "./components/admin/UploadVideo";
import ContestPage from "./pages/ContestPage";
import ContestProblem from "./components/contest/ContestProblem";
import UserProfile from "./pages/UserProfilePage";
import DetailsLeaderboard from "./components/contest/DetailsLeaderboard";
import { clearError } from "./features/auth/authSlice";
import AiInterviewer from "./pages/AiInterviewer";
import PlanPage from "./pages/PlanPage";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./utils/PrivateRoute";
import IntroAnimation from "./components/ui/IntroAnimation";
import Footer from "./components/ui/Footer";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;
  const theme = useSelector((state) => state.ui.theme);
  const [showIntro, setShowIntro] = useState(path === "/");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    dispatch(checkAuth()).finally(() => {
      dispatch(clearError());
    });
  }, [dispatch]);

  if (showIntro && path === "/") {
    return <IntroAnimation onEnd={() => setShowIntro(false)} />;
  }

  return (
    <div className="bg-white dark:bg-neutral/95">
      <Toaster position="top-center" />
      <div className="fixed top-0 z-100 w-full">
        <Navbar />
      </div>

      <Routes>
        <Route index element={isAuthenticated ? <Home /> : <LandingPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/problemset" element={<ProblemSet />} />
        <Route path="/problems/:problemId" element={<CodeEditor />} />
        <Route path="/daily-challenge/:problemId" element={<CodeEditor />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/ai-interview"
          element={
            <PrivateRoute>
              <AiInterviewer />
            </PrivateRoute>
          }
        ></Route>
        <Route path="admin/upload/:problemId" element={<UploadVideo />}></Route>
        <Route
          path="/contest"
          element={
            <PrivateRoute>
              <ContestPage />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/contest/:contestId"
          element={
            <PrivateRoute>
              <ContestProblem />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/contest/:contestId/problem/:problemId"
          element={
            <PrivateRoute>
              <CodeEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard/:contestId"
          element={
            <PrivateRoute>
              <DetailsLeaderboard />
            </PrivateRoute>
          }
        />
        <Route path="/plans" element={<PlanPage />} />
      </Routes>
      {!path.startsWith("/problems") &&
        path !== "/login" &&
        path !== "/register" && <Footer />}
    </div>
  );
}

export default App;
