import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { setShowAll } from "../../features/ui/uiSlice";
import { useState } from "react";

function RecentActivity({ allSubmission }) {
  const [timeFilter, setTimeFilter] = useState("24h");
  const { showAll } = useSelector((state) => state.ui);
  const navigate = useNavigate();

  const sortedSubmissions = [...allSubmission].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const now = new Date();
  const getTimeThreshold = () => {
    switch (timeFilter) {
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "1m":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "all":
        return null;
      case "24h":
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  };

  const threshold = getTimeThreshold();

  const timeFilteredSubmissions = threshold
    ? sortedSubmissions.filter(
        (activity) => new Date(activity.createdAt) >= threshold
      )
    : sortedSubmissions;

  const filteredSubmissions = showAll
    ? timeFilteredSubmissions
    : timeFilteredSubmissions.slice(0, 3);

  const getActivityIcon = (status) => {
    switch (status) {
      case "accepted":
        return (
          <div className="p-2 bg-emerald-100 rounded-full">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
        );

      case "wrong answer":
        return (
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
        );

      case "error":
        return (
          <div className="p-2 bg-orange-100 rounded-full">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
        );

      case "pending":
      default:
        return (
          <div className="p-2 bg-yellow-100 rounded-full">
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
        );
    }
  };

  const getLanguageBadge = (language) => {
    const colors = {
      javascript: "bg-yellow-100 text-yellow-800 border-yellow-200",
      java: "bg-orange-100 text-orange-800 border-orange-200",
      cpp: "bg-purple-100 text-purple-800 border-purple-200",
    };

    return (
      <span
        className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
          colors[language] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {language}
      </span>
    );
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      accepted: {
        bg: "bg-emerald-50 border-emerald-200",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      "wrong answer": {
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
        dot: "bg-red-500",
      },
      error: {
        bg: "bg-orange-50 border-orange-200",
        text: "text-orange-700",
        dot: "bg-orange-500",
      },
      pending: {
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
      },
    };
    const config = statusConfig[status] || statusConfig["error"];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
        {status}
      </span>
    );
  };

  const getDuration = (createdAt) => {
    const currentDate = new Date();
    const submitDate = new Date(createdAt);
    const diffMs = currentDate.getTime() - submitDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const handleGotoProblemPage = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  return (
    <div className="bg-white/70 dark:bg-black/10 backdrop-blur-sm border overflow-auto scrollbar-hide max-h-112 lg:w-150 pb-8  border-white/20 rounded-2xl shadow-xl">
      <div className="px-6 sticky top-0 z-20 bg-white dark:bg-white/5">
        <div className="py-4 border-b border-gray-100 dark:border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent outline-none text-sm ml-2 px-2 py-1 rounded-md border border-gray-200"
              >
                <option value="24h">⏱️ Last 24 Hours</option>
                <option value="7d">📅 Last 7 Days</option>
                <option value="1m">🗓️ Last 1 Month</option>
                <option disabled>────────────</option>
                <option value="all">
                  🗓️ All Activity ({allSubmission.length})
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end py-1">
          {allSubmission.length > 4 && (
            <div className="flex justify-center">
              <button
                onClick={() => dispatch(setShowAll((prev) => !prev))}
                className="btn btn-primary btn-soft"
              >
                {showAll ? (
                  <>
                    <ChevronRight className="h-4 w-4 -rotate-90" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 rotate-90" />
                    View All ({timeFilteredSubmissions.length} more)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="pt-1 px-6">
        <div className="space-y-4">
          {filteredSubmissions.map((activity, index) => (
            <div
              onClick={() => handleGotoProblemPage(activity.problemId._id)}
              key={activity._id}
              className="group relative bg-gradient-to-r from-white dark:from-black to-gray-50 dark:to-gray-500/50 hover:from-blue-50 dark:hover:from-black hover:to-indigo-50 dark:hover:to-gray-500/50 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-blue-200 transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {getActivityIcon(activity.status)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-white/80 mb-1">
                        Submitted a solution for
                      </p>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-700 transition-colors">
                        {activity?.problemId?.title}
                      </h4>

                      <div className="flex items-center gap-3 mb-3">
                        {getLanguageBadge(activity.language)}
                        {getStatusBadge(activity.status)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-200">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {getDuration(activity.createdAt)}
                          </span>
                          {activity.runtime && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5" />
                              {activity.runtime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;
