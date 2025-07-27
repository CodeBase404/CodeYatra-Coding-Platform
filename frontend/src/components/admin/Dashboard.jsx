import {
  Clock,
  Code2,
  FileText,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import RecentActivityList from "./RecentActivityList";
import { setShowAll } from "../../features/ui/uiSlice";

function Dashboard() {
  const { problems, allSubmission } = useSelector((state) => state.problems);
  const { showAll } = useSelector((state) => state.ui);
  const [users, setUsers] = useState(null);
  const dispatch = useDispatch();

  const totalProblems = problems?.length;
  const countByDifficulty = {
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  };

  const difficultyData = [
    {
      label: "Easy Problems",
      color: "green",
      count: countByDifficulty.easy,
    },
    {
      label: "Medium Problems",
      color: "yellow",
      count: countByDifficulty.medium,
    },
    {
      label: "Hard Problems",
      color: "red",
      count: countByDifficulty.hard,
    },
  ];

  const getPercent = (count) =>
    totalProblems === 0 ? 0 : ((count / totalProblems) * 100).toFixed(1);

  const recentActivity = allSubmission
    .filter((s) => {
      const createdAt = new Date(s.createdAt);
      const now = new Date();
      const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    })
    .map((s) => ({
      id: s._id,
      user: s.userId.firstName,
      status:
        s.status === "accepted"
          ? "accepted"
          : s.status === "wrong answer"
          ? "wrong answer"
          : s.status === "error"
          ? "error"
          : "pending",
      problem: s?.problemId?.title,
      time: new Date(s.createdAt).toLocaleString(),
      createdAt: s.createdAt,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axiosClient.get("/user/all-users");
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4 container mx-auto md:mt-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">
                Total Problems
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-400">
                {" "}
                {totalProblems}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5  p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">
                Total Submissions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-400">
                {allSubmission?.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Code2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5  p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Active Users</p>
              <p className="text-2xl font-bold text-gray-900  dark:text-gray-400">
                {users?.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5  p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Recent Submissions (24h)
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                {recentActivity?.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
          <h3 className=" text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Problem Difficulty Distribution
          </h3>
          <div className="flex flex-col gap-4">
            {difficultyData.map((item) => (
              <div
                key={item.label}
                className={`text-center p-4 bg-${item.color}-50 dark:bg-white/10 rounded-lg`}
              >
                <div className={`text-2xl font-bold text-${item.color}-600`}>
                  {item.count}
                </div>
                <div className={`text-sm text-${item.color}-400 font-medium`}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getPercent(item.count)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-white/5 px-6 pb-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between my-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            {recentActivity.length > 5 && (
              <div
                onClick={() => dispatch(setShowAll(!showAll))}
                className="btn btn-dash btn-primary text-center"
              >
                <button className="text-sm hover:underline">
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
          <RecentActivityList
            recentActivity={recentActivity}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
