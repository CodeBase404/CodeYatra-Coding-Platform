import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../components/admin/AdminSidebar";
import Dashboard from "../components/admin/Dashboard";
import AllProblem from "../components/admin/AllProblem";
import {
  fetchAllProblems,
  getAllSubmissions,
  getAllVideoSolution,
} from "../features/problem/problemThunks";
import { useEffect} from "react";
import VideoSolution from "../components/admin/VideoSolution";
import Contest from "../components/admin/Contest";
import { fetchAllContests } from "../features/contest/contestThunks";
import { PanelLeftOpen} from "lucide-react";
import Profile from "../components/ui/UserProfile";
import { fetchUserProfile } from "../features/auth/authThunks";
import { setIsCollapsed, setIsMobileOpen } from "../features/ui/uiSlice";

function Admin() {
  const { adminSelectedTab, isCollapsed, isMobileOpen } = useSelector(
    (state) => state.ui
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProblems());
    dispatch(getAllSubmissions());
    dispatch(getAllVideoSolution());
    dispatch(fetchAllContests());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const toggleMobileSidebar = () => {
    dispatch(setIsMobileOpen(!isMobileOpen));
  };

  const toggleCollapse = () => {
    dispatch(setIsCollapsed(!isCollapsed));
  };

  return (
    <div className="flex pt-13 bg-[#F3F4F6] dark:bg-neutral/10">
      <div
        className={`fixed z-25 h-full bg-white dark:bg-neutral/10 transition-transform duration-300 ease-in-out ${
          isMobileOpen
            ? "translate-x-0 md:translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } ${
          isCollapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        <AdminSidebar
          onToggleCollapse={toggleCollapse}
          isMobile={window.innerWidth < 768}
          toggleMobileSidebar={toggleMobileSidebar}
        />
      </div>
      <div
        className={`flex-1 pt-11 md:pt-0 transition-all duration-300 ease-in-out  h-screen overflow-y-auto scrollbar-hide ${
          isCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <div className="md:hidden mt-1 px-2 fixed top-14 z-10">
          <button
            className="p-2 rounded-lg bg-gray-200 dark:bg-neutral hover:bg-gray-200 hover:text-green-600 text-gray-700"
            onClick={toggleMobileSidebar}
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        </div>
        {adminSelectedTab === "dashboard" && (
          <div className="px-2 text-slate-400 text-sm flex items-center justify-center h-full">
            <Dashboard />
          </div>
        )}

        {adminSelectedTab === "problems" && (
          <div className="px-2 text-slate-400 text-sm flex items-center justify-center h-full">
            <AllProblem />
          </div>
        )}

        {adminSelectedTab === "videos" && (
          <div className="px-2 text-slate-400 text-sm flex items-center justify-center h-full">
            <VideoSolution />
          </div>
        )}

        {adminSelectedTab === "contest" && (
          <div className="px-2 text-slate-400 text-sm flex items-center justify-center h-full">
            <Contest />
          </div>
        )}
        {adminSelectedTab === "profile" && (
          <div className="px-2 text-slate-400 text-sm flex items-center justify-center h-full">
            <Profile />
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
