import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Clock,
  Users,
  Target,
  Zap,
  Calendar,
  ChevronRight,
  Play,
  Crown,
  Flame,
  Timer,
  CheckCircle,
  Gift,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllContests } from "../features/contest/contestThunks";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import LiveLeaderboard from "../components/contest/LiveLeaderboard";

const ContestPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [timeLeft, setTimeLeft] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contests } = useSelector((state) => state.contests);

  useEffect(() => {
    dispatch(fetchAllContests());
  }, [dispatch]);

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

  const getContestStatus = (startTime, endTime) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "live";
    return "ended";
  };

  const liveContests = contests.filter(
    (contest) => getContestStatus(contest.startTime, contest.endTime) === "live"
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {};

      contests.forEach((contest) => {
        const now = new Date().getTime();
        const contestTime = new Date(contest.startTime).getTime();
        const difference = contestTime - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          const parts = [];
          if (days > 0) parts.push(`${days}d`);
          if (hours > 0 || days > 0) parts.push(`${hours}h`);
          if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
          parts.push(`${seconds}s`);

          newTimeLeft[contest._id] = parts.join(" ");
        } else {
          newTimeLeft[contest._id] = "Started";
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [contests]);

  const formatRemainingTime = (endTime) => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return "Ended";

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && days === 0) parts.push(`${seconds}s`);

    return parts.join(" ");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "from-blue-500 to-cyan-500";
      case "live":
        return "from-red-500 to-pink-500";
      case "ended":
        return "from-gray-500 to-slate-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Weekly":
        return <Calendar className="w-5 h-5" />;
      case "Biweekly":
        return <Trophy className="w-5 h-5" />;
      case "Special":
        return <Crown className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const alreadyJoined = liveContests.map((c) => c.registered === true)[0];

  const handleRegister = async (contestId) => {
    try {
      const confirmed = window.confirm("Do you want to register Contest?");
      if (!confirmed) return;
      const res = await axiosClient.post(`/contest/${contestId}/register`);
      dispatch(fetchAllContests());
      toast.success("Registered successfully!");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleDeregister = async (contestId) => {
    try {
      const confirmed = window.confirm("Do you want to leave this contest?");
      if (!confirmed) return;
      await axiosClient.post(`/contest/${contestId}/deregister`);

      dispatch(fetchAllContests());
      toast.success("You left the contest!");
    } catch (err) {
      console.error("Deregistration failed:", err);
    }
  };

  const handleJoinContest = async (contestId) => {
    if (!alreadyJoined) {
      const confirmed = window.confirm("Do you want to join?");
      if (!confirmed) return;
    }

    try {
      await axiosClient.post(`/contest/${contestId}/register`);
      navigate(`/contest/${contestId}`);
      if (!alreadyJoined) {
        toast.success("Register and Join successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to Join for contest");
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-slate-50 dark:from-purple-100 via-white dark:via-rose-300 to-purple-50 dark:to-purple-200">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 dark:from-neutral via-blue-600 dark:via-black/85 to-indigo-700 dark:to-neutral">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">
                Compete with the Best
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              CodeYatra
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                {" "}
                Contests
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Challenge yourself in weekly competitions, climb the global
              leaderboard, and win amazing prizes while improving your coding
              skills
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">50K+</p>
                  <p className="text-sm text-blue-100">Active Participants</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">$100K+</p>
                  <p className="text-sm text-blue-100">Prize Pool</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">3x</p>
                  <p className="text-sm text-blue-100">Weekly Contests</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-200 rounded-2xl shadow-xl border border-gray-100 dark:border-white/15 p-2 mb-8"
        >
          <div className="flex">
            {[
              {
                key: "upcoming",
                label: "Upcoming",
                icon: <Clock className="w-5 h-5" />,
              },
              {
                key: "live",
                label: "Live Now",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                key: "past",
                label: "Past Contests",
                icon: <Trophy className="w-5 h-5" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 mx-1 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-purple-500 dark:from-bg-black to-blue-600 text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-600  hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-200 cursor-pointer"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.key === "live" && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === "upcoming" &&
                (() => {
                  const upcomingContests = contests.filter(
                    (c) =>
                      getContestStatus(c.startTime, c.endTime) === "upcoming"
                  );
                  return (
                    <motion.div
                      key="upcoming"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {upcomingContests.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 text-lg font-semibold">
                          🚫 No upcoming contests
                        </div>
                      ) : (
                        upcomingContests.map((contest, index) => (
                          <motion.div
                            key={contest._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                          >
                            <div className="p-8">
                              <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-16 h-16 bg-gradient-to-r ${getStatusColor(
                                      getContestStatus(
                                        contest.startTime,
                                        contest.endTime
                                      )
                                    )} rounded-2xl flex items-center justify-center`}
                                  >
                                    {getTypeIcon(contest.type)}
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-1">
                                      {contest.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusColor(
                                          getContestStatus(
                                            contest.startTime,
                                            contest.endTime
                                          )
                                        )} text-white`}
                                      >
                                        Weekly
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-3xl font-bold text-purple-600 mb-1">
                                    {timeLeft[contest._id] || "Loading..."}
                                  </div>
                                  <p className="text-gray-500 text-sm">
                                    Time to start
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 dark:bg-black/10 dark:border dark:border-white/10 rounded-xl">
                                  <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                  <p className="font-bold text-gray-900 dark:text-gray-200">
                                    {contest.registrations.length || 0}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Registered
                                  </p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-black/10 dark:border dark:border-white/10 rounded-xl">
                                  <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                  <p className="font-bold text-gray-900 dark:text-gray-200">
                                    {contest.problems?.length || 0}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:dark:text-gray-400">
                                    Problems
                                  </p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-black/10 dark:border dark:border-white/10 rounded-xl">
                                  <Timer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                  <p className="font-bold text-gray-900 dark:dark:text-gray-200">
                                    {getDuration(
                                      contest.startTime,
                                      contest.endTime
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:dark:text-gray-400">
                                    Duration
                                  </p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-black/10 dark:border dark:border-white/10 rounded-xl">
                                  <Gift className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                                  <p className="font-bold text-gray-900 dark:dark:text-gray-200">
                                    {contest.prize || "TBD"}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:dark:text-gray-400">
                                    Prize Pool
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {contest.registered ? (
                                    <>
                                      <div className="flex items-center btn border dark:btn-ghost dark:border-white/10 dark:hover:bg-black/10 gap-2 text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-semibold">
                                          Registered
                                        </span>
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleDeregister(contest._id)
                                        }
                                        className="flex gap-1.5 btn btn-dash btn-error hover:text-white transition-all"
                                      >
                                        <LogOut className="h-4 w-4" /> Leave
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleRegister(contest._id)
                                      }
                                      className="btn btn-dash btn-primary dark:text-white/50 dark:hover:text-white px-6 py-3 font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                    >
                                      Register Now
                                      <ArrowRight className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>

                                <button className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                                  View Details
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  );
                })()}

              {activeTab === "live" &&
                (() => {
                  const liveContests = contests.filter(
                    (c) => getContestStatus(c.startTime, c.endTime) === "live"
                  );
                  return (
                    <motion.div
                      key="live"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {liveContests.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 text-lg font-semibold">
                          🚫 No live contests
                        </div>
                      ) : (
                        liveContests.map((contest) => (
                          <div
                            key={contest._id}
                            className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 text-white"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                  <Zap className="w-8 h-8" />
                                </div>
                                <div>
                                  <h2 className="text-3xl font-bold mb-1">
                                    {contest.name}
                                  </h2>
                                  <p className="text-red-100">
                                    Live Now •{" "}
                                    {formatRemainingTime(contest.endTime)}{" "}
                                    remaining
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleJoinContest(contest._id)}
                                className="btn btn-dash hover:text-rose-600 font-bold transition-colors flex items-center gap-2"
                              >
                                <Play className="w-5 h-5" />
                                <span>
                                  {" "}
                                  {alreadyJoined ? "Continue" : "Join Contest"}
                                </span>
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                              <div className="text-center">
                                <p className="text-3xl font-bold">
                                  {contest.registrations.length || 0}
                                </p>
                                <p className="text-red-100">Participants</p>
                              </div>
                              <div className="text-center">
                                <p className="text-3xl font-bold">
                                  {contest.problems?.length || 0}
                                </p>
                                <p className="text-red-100">Problems</p>
                              </div>
                              <div className="text-center">
                                <p className="text-3xl font-bold">
                                  {contest.prize || "TBD"}
                                </p>
                                <p className="text-red-100">Prize Pool</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  );
                })()}

              {activeTab === "past" && (
                <motion.div
                  key="past"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Recent Contests
                  </h3>
                  <div className="space-y-4">
                    {contests
                      .filter(
                        (c) =>
                          getContestStatus(c.startTime, c.endTime) === "ended"
                      )
                      .map((contest, index) => (
                        <div
                          key={contest._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {contest.name}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              {new Date(contest.endTime).toLocaleDateString()} •{" "}
                              {contest.registrations?.length || 0} participants
                            </p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View Results
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6 mb-10">
            {liveContests.length > 0 ? (
              liveContests.map((contest) => (
                <LiveLeaderboard
                  key={contest._id}
                  contestId={contest._id}
                  contestName={contest?.name}
                />
              ))
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-6 text-center text-gray-500">
                🚫 No live contest leaderboard
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestPage;
