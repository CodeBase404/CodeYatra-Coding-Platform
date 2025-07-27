import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useSelector } from "react-redux";

const RecentActivityList = ({ recentActivity }) => {
  const { showAll } = useSelector((state) => state.ui);
  const visibleActivities = showAll
    ? recentActivity
    : recentActivity.slice(0, 5);

  const getActivityIcon = (status) => {
    const configs = {
      accepted: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-600/10",
        borderColor: "border-green-200 dark:border-green-500/5",
        label: "Accepted",
      },
      "wrong answer": {
        icon: XCircle,
        color: "text-red-600 dark:text-red-500/90",
        bgColor: "bg-red-50 dark:bg-red-500/10",
        borderColor: "border-red-200 dark:border-red-400/8",
        label: "Wrong Answer",
      },
      error: {
        icon: AlertTriangle,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-400/10",
        borderColor: "border-purple-200 dark:border-purple-400/8",
        label: "Error",
      },
      pending: {
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-200/10",
        borderColor: "border-orange-200 dark:border-orange-300/8",
        label: "Pending",
      },
    };
    return configs[status];
  };

  return (
    <div className="space-y-4 max-h-107 overflow-auto">
      {visibleActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-neutral/20 rounded-lg"
        >
          {(() => {
            const config = getActivityIcon(activity.status.toLowerCase());
            if (!config) return null;

            const Icon = config.icon;
            return (
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${config.bgColor} ${config.borderColor}`}
              >
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
            );
          })()}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
              <span className="font-bold text-yellow-500">{activity.user}</span>{" "}
              submitted a solution for{" "}
              <span className="font-semibold text-emerald-600">
                {activity.problem}
              </span>
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : activity.status === "wrong"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {activity.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList;
