import { matchPath, NavLink, useLocation, useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Crown,
  List,
  Menu,
  Moon,
  Pause,
  Play,
  RefreshCw,
  Sun,
  Timer,
} from "lucide-react";
import avtar from "/avatar.avif";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logoutUser } from "../../features/auth/authThunks";
import toast from "react-hot-toast";
import { toggleTheme } from "../../features/ui/uiSlice";
import TimerClock from "./TimerClock";
import ProblemListSidebar from "./ProblemListSidebar";

function Navbar() {
  const [isopen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { problems } = useSelector((state) => state.problems);
  const theme = useSelector((state) => state.ui.theme);
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("stopwatch");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [timerDuration, setTimerDuration] = useState({
    hours: 1,
    minutes: 0,
    seconds: 0,
  });
  const navigate = useNavigate();
  const match = matchPath("/problems/:problemId", location.pathname);
  const problemId = match?.params?.problemId;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      //  setSolvedProblems([]);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.message || "Logout failed");
    }
  };

  const currentIndex = problems.findIndex((p) => p._id === problemId);

  const goToPrev = () => {
    if (currentIndex > 0) {
      navigate(`/problems/${problems[currentIndex - 1]._id}`);
    }
  };

  const goToNext = () => {
    if (currentIndex < problems.length - 1) {
      navigate(`/problems/${problems[currentIndex + 1]._id}`);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getDisplayTime = () => {
    if (mode === "timer" && time === 0 && !isRunning) {
      const totalSeconds =
        timerDuration.hours * 3600 +
        timerDuration.minutes * 60 +
        timerDuration.seconds;
      return formatTime(totalSeconds);
    }
    return formatTime(time);
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div
      className="sticky top-0 flex items-center justify-between bg-white/80 dark:bg-neutral/5 backdrop-blur-md border-b border-gray-200 dark:border-gray-500/20 transition-colors duration-300 px-2 md:px-5 lg:px-10 py-1.5 text-black
     dark:text-white w-full font-medium"
    >
      <div className="flex items-center gap-2 md:gap-6 select-none">
        <div
          className="p-2 md:hidden hover:bg-gray-400 cursor-pointer rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <Menu />
        </div>
        <NavLink to="/" className="flex gap-1.5 font-bold">
          <Code /> <span className="hidden md:block">CodeYatra</span>
        </NavLink>
        {path.startsWith("/problems/") && (
          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsProblemListOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:text-orange-400 transition-all"
            >
              <List size={20} className="mt-0.5" />
              ProblemList
            </div>
            <div className="flex gap-2">
              <ChevronLeft
                onClick={goToPrev}
                className={`hover:bg-black/20 dark:hover:bg-gray-500 rounded-md cursor-pointer ${
                  currentIndex <= 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              <ChevronRight
                onClick={goToNext}
                className={` hover:bg-black/20 dark:hover:bg-gray-500 rounded-md cursor-pointer ${
                  currentIndex >= problems.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          </div>
        )}

        <div className="hidden md:block">
          {!path.startsWith("/problems/") && isAuthenticated && (
            <div className="flex md:gap-3 lg:gap-6 text-[14px] select-none">
              <NavLink to="/">Explore</NavLink>
              <NavLink to="/problemset">Problems</NavLink>
              <NavLink to="/contest">Contest</NavLink>
              <NavLink to="/ai-interview">Ai Interviewer</NavLink>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        {path.startsWith("/problems/") && (
          <div
            onClick={() => setShow((prev) => !prev)}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-2 p-1 cursor-pointer hover:bg-white/15 transition-all duration-300 shadow-2xl "
          >
            <div className="flex items-center justify-center gap-1 text-white">
              {time > 0 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRunning((prev) => !prev);
                  }}
                  className="p-1 rounded-md hover:bg-white/10"
                >
                  {isRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>
              )}
              {time > 0 && getDisplayTime()}
              <div className="p-1 rounded-md hover:bg-white/10">
                {time > 0 ? (
                  <RefreshCw className="w-4 h-4" />
                ) : (
                  <Timer className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-11 w-75 right-25">
          <TimerClock
            show={show}
            mode={mode}
            setMode={setMode}
            time={time}
            setTime={setTime}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            timerDuration={timerDuration}
            setTimerDuration={setTimerDuration}
            setShow={setShow}
          />
        </div>
        <button onClick={() => dispatch(toggleTheme())}>
          {theme === "dark" ? <Moon /> : <Sun />}
        </button>

        {isAuthenticated && (
          <div className="dropdown dropdown-bottom dropdown-end cursor-pointer select-none">
            <img
              tabIndex={0}
              src={user?.profileImage?.secureUrl || avtar}
              className="rounded-full object-cover h-8 w-8"
              alt=""
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-neutral mt-3 rounded-box z-1 w-42 text-white p-2 border-1 border-gray-500/30"
            >
              {user?.role === "user" && (
                <li>
                  <NavLink to={user?.role === "user" && "/user"}>
                    Profile
                  </NavLink>
                </li>
              )}
              {user?.role === "admin" && (
                <>
                  <li>
                    <NavLink to={user?.role === "admin" && "/user"}>
                      Admin as a user
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={user?.role === "admin" && "/admin"}>
                      Admin Profile
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className={`${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>
        )}

        <NavLink
          to="/plans"
          className="btn btn-dash btn-warning hover:text-white flex items-center gap-2"
        >
          {user?.premiumPlan?.isActive ? (
            <>
              <Crown className="w-4 h-4" /> Your Plan
            </>
          ) : (
            "Get Premium"
          )}
        </NavLink>
        {!isAuthenticated && (
          <NavLink
            to="/register"
            className="btn btn-dash btn-primary flex items-center gap-2"
          >
            Register
          </NavLink>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`btn btn-dash btn-error hover:text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <NavLink
            to="/login"
            className="btn btn-dash btn-secondary flex items-center gap-2"
          >
            Log in
          </NavLink>
        )}
      </div>

      {/* mobile */}
      <div
        className={`fixed left-0 top-0 bg-white dark:bg-[#1E1E1E] z-[100]  h-full transition-all w-[65%] md:hidden ${
          isopen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar setIsOpen={setIsOpen} />
      </div>
      <ProblemListSidebar
        isOpen={isProblemListOpen}
        onClose={() => setIsProblemListOpen(false)}
      />
    </div>
  );
}

export default Navbar;
