import { useState } from "react";
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  Play,
  CheckCircle,
  AlertCircle,
  Code,
  Timer,
  Search,
  Grid3X3,
  List,
  Trash2,
  Zap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import { deleteContestFromStore } from "../../features/contest/contestSlice";
import { motion } from "motion/react";

const AllContests = ({ userRegisteredOnly = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const dispatch = useDispatch();
  const { contests, loading, error } = useSelector((state) => state.contests);
  const user = useSelector((state) => state.auth.user);
  const [isDeleting, setIsDeleting] = useState(null);
  const path = location.pathname;

  const handleDeleteContest = async (contestId) => {
    if (!window.confirm("Are you sure you want to delete this Contest?"))
      return;
    setIsDeleting(contestId);

    try {
      const res = await axiosClient.delete(`/contest/${contestId}`);
      dispatch(deleteContestFromStore(contestId));
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const getContestStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "live";
    return "ended";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "live":
        return <Play className="w-4 h-4" />;
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "ended":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-600 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "ended":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const filteredContests = contests.filter((contest) => {
    const date = contest.registrations.map((p) => p.registeredAt);
    console.log(date);

    const matchesSearch = contest.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const status = getContestStatus(contest.startTime, contest.endTime);
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    const isUserRegistered = userRegisteredOnly
      ? contest.registrations?.some((reg) => reg.user === user._id)
      : true;

    return matchesSearch && matchesStatus && isUserRegistered;
  });

  const ContestCard = ({ contest }) => {
    const status = getContestStatus(contest.startTime, contest.endTime);
    return (
      <div
        className={`bg-white dark:bg-gray-500/10 rounded-3xl shadow-lg border-5 border-gray-100 dark:border-gray-200/5
        hover:shadow-2xl transition-all duration-500 ease-out
        transform hover:-translate-y-2 hover:scale-[1.02]
        group overflow-auto w-full h-full
        hover:ring-2 ' : ''}
        ${
          status === "live"
            ? "hover:ring-green-500/30"
            : status === "upcoming"
            ? "hover:ring-blue-500/30"
            : "hover:ring-gray-500/30"
        }`}
      >
        <div className="p-6 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 w-[95%] max-h-15 group-hover:text-blue-600 transition-colors line-clamp-2">
                {contest.name}
              </h3>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border shadow-sm backdrop-blur-sm  transform group-hover:scale-105 transition-transform duration-200 ${
                status === "live" && "animate-bounce"
              } ${getStatusColor(status)}`}
            >
              {getStatusIcon(status)}
              <span className="ml-1 capitalize">{status}</span>
            </div>
          </div>

          {/* Contest Info */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-white/90">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-blue-400">Date</p>
                    <p className="text-sm font-semibold">
                      {formatDate(contest.startTime)} -{" "}
                      {formatDate(contest.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-green-500">Time</p>
                    <p className="text-sm font-semibold dark:text-white">
                      {formatTime(contest.startTime)} -{" "}
                      {formatTime(contest.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Timer className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-purple-500">
                      Duration
                    </p>
                    <p className="text-sm font-semibold dark:text-white/90">
                      {getDuration(contest.startTime, contest.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Code className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-orange-400/90">
                      Problems
                    </p>
                    <p className="text-sm font-semibold dark:text-white">
                      {contest.problems.length} problem
                      {contest.problems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {user.role === "admin" && path === "/admin" && (
              <div className="flex items-center text-gray-600">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    {contest?.registrations?.length || 0}
                  </span>
                  <p className="text-xs text-gray-500">Participants</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <span>
                {user.role === "admin" && path === "/admin"
                  ? `Created ${formatDate(contest.createdAt)}`
                  : ` Register at ${formatDate(
                      contest.registrations.map((p) => p.registeredAt)
                    )}`}
              </span>
            </div>
            {user.role === "admin" && path === "/admin" && (
              <button
                onClick={() => handleDeleteContest(contest._id)}
                disabled={isDeleting === contest._id}
                className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold py-3 px-6 rounded-xl border border-red-200 hover:border-red-300 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2
                  className={`w-4 h-4 mr-1 ${
                    isDeleting === contest._id ? "animate-spin" : ""
                  }`}
                />
                {isDeleting === contest._id ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ContestListItem = ({ contest }) => {
    const status = getContestStatus(contest.startTime, contest.endTime);

    return (
      <div className="bg-white dark:bg-white/3 rounded-xl shadow-md border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all duration-300 group">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {contest.name}
                </h3>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    status === "live" && "animate-bounce"
                  } ${getStatusColor(status)}`}
                >
                  {getStatusIcon(status)}
                  <span className="ml-1 capitalize">{status}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                  {formatDate(contest.startTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-green-500" />
                  {formatTime(contest.startTime)}
                </div>
                <div className="flex items-center">
                  <Timer className="w-4 h-4 mr-1 text-purple-500" />
                  {getDuration(contest.startTime, contest.endTime)}
                </div>
                <div className="flex items-center">
                  <Code className="w-4 h-4 mr-1 text-orange-500" />
                  {contest.problems.length} Problems
                </div>
                {user.role === "admin" && path === "/admin" && (
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1 text-yellow-400" />
                    <span className="text-sm">
                      {contest.registrations?.length || 0} Participants
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center text-gray-500 text-sm">
                <span>
                  {user.role === "admin" && path === "/admin"
                    ? `Created ${formatDate(contest.createdAt)}`
                    : ` Register at ${formatDate(
                        contest.registrations.map((p) => p.registeredAt)
                      )}`}
                </span>
              </div>
              {user.role === "admin" && path === "/admin" && (
                <button
                  onClick={() => handleDeleteContest(contest._id)}
                  disabled={isDeleting === contest._id}
                  className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold py-3 px-6 rounded-xl border border-red-200 hover:border-red-300 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2
                    className={`w-4 h-4 mr-1 ${
                      isDeleting === contest._id ? "animate-spin" : ""
                    }`}
                  />
                  {isDeleting === contest._id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 h-full">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-600/5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-200/10 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200  dark:border-gray-200/10 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-2 overflow-auto"
        >
          <div className="flex flex-wrap gap-2">
            {[
              {
                key: "all",
                label: "All",
                icon: <Clock className="w-5 h-5" />,
              },
              {
                key: "upcoming",
                label: "Upcoming",
                icon: <Clock className="w-5 h-5" />,
              },
              {
                key: "live",
                label: "Live",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                key: "ended",
                label: "Past",
                icon: <Trophy className="w-5 h-5" />,
              },
            ].map((tab) => {
              const count = contests.filter((c) => {
                const status = getContestStatus(c.startTime, c.endTime);
                const matchesStatus = tab.key === "all" || status === tab.key;

                const isUserRegistered = userRegisteredOnly
                  ? c.registrations?.some((reg) => reg.user === user._id)
                  : true;
                return matchesStatus && isUserRegistered;
              }).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 lg:gap-3 py-4 px-3 lg:px-6 rounded-xl hover:bg-gray-100 font-semibold transition-all duration-300 ${
                    statusFilter === tab.key
                      ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span className="bg-white text-gray-700 text-xs font-bold rounded-full px-2 py-0.5">
                    {count}
                  </span>
                  {tab.key === "live" && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading contests...</span>
        </div>
      )}

      {/* Contest Cards/List */}
      {!loading && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredContests.map((contest) => (
                <ContestCard key={contest._id} contest={contest} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContests.map((contest) => (
                <ContestListItem key={contest._id} contest={contest} />
              ))}
            </div>
          )}

          {filteredContests.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No contests found
              </h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllContests;
