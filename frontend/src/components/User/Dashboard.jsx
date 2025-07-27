import { Code2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSolvedProblems,
  getAllSubmissions,
} from "../../features/problem/problemThunks";
import UserProgress from "./UserProgress";
import RecentActivity from "./RecentActivity";
import FavoriteProblems from "../ui/FavoriteProblems";

function Dashboard() {
  const { allSubmission } = useSelector(
    (state) => state.problems
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSubmissions());
    dispatch(fetchSolvedProblems());
  }, [dispatch]);

  return (
    <div className="h-full py-2 flex flex-col gap-2">
      <div className="text-black text-3xl pl-5 py-3 dark:text-white">All info </div>
      <UserProgress allSubmission={allSubmission} />
      <div className="flex justify-center gap-10">
      <RecentActivity allSubmission={allSubmission} />
      <div className="border border-white/20 rounded-2xl">
      <FavoriteProblems />
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
