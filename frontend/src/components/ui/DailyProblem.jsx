import React, { useEffect, useState } from "react";
import { Calendar, Tag, Clock, CheckCircle } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import { NavLink } from "react-router";

const DailyProblem = () => {
  const [challenge, setChallenge] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyStatus = async () => {
      try {
        const res = await axiosClient.get("/daily-challenge");
        setChallenge(res.data.challenge);
        setIsSolved(res.data.isSolved);
      } catch (error) {
        if (error.response?.status === 404) {
          setChallenge(null);
        } else {
          console.error("Failed to fetch daily challenge status:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDailyStatus();
  }, []);

  if (loading)
    return (
      <span className="loading loading-bars loading-lg text-green-500"></span>
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!challenge) {
    return (
      <div className="w-full md:min-h-85 bg-white dark:bg-white/5 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Daily Challenge</span>
            </div>
            <div className="text-white text-sm font-medium">
              {formatDate(new Date())}
            </div>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-600 font-medium p-6">
          ⏳ Today’s challenge will be available at <strong>9:00 AM</strong>.
        </div>
      </div>
    );
  }

  const { date, problemId, _id: challengeId } = challenge;
  const { difficulty, tags, title } = problemId;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-2xl mx-auto max-h-70 bg-white dark:bg-neutral/5 rounded-2xl shadow-lg border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Daily Challenge</span>
          </div>
          <div className="text-white text-sm font-medium">
            {formatDate(date)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {title}
        </h2>

        <div className="flex items-center justify-between mb-2">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
              difficulty
            )}`}
          >
            <Clock className="w-4 h-4 mr-1" />
            <span className="capitalize">{difficulty}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <span className="capitalize">{tags}</span>
            </span>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          {isSolved ? (
            <div className="flex items-center text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5 mr-2" />
              Solved Today 🎉
            </div>
          ) : (
            <NavLink
              to={`/daily-challenge/${problemId._id}`}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Problem
            </NavLink>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-neutral/5 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-white/50">
          <span>Problem ID: {problemId._id.slice(-8)}</span>
          <span>Challenge #{challengeId.slice(-8)}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyProblem;
