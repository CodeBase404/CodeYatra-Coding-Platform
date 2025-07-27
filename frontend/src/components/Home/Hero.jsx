import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import {
  Play,
  Trophy,
  Code2,
  CalendarRange,
  CalendarHeart,
  Brain,
  TrendingUp,
  Users,
} from "lucide-react";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {problem} = useSelector(state=>state.problems)
  console.log(problem);
  

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-13 min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black/30">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
            Master{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Algorithms
            </span>
            <br />
            Excel in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Interviews
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of coders practicing coding problems, competing
            in contests, and preparing for technical interviews with our
            AI-powered platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <NavLink to="/problems/683db5aed3fc98ddef72626e"  className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
              <Play className="inline-block w-5 h-5 mr-2" />
              Start Solving
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
            </NavLink>

            <NavLink to="/contest" className="group px-8 py-4 bg-transparent border-2 border-blue-500 text-blue-400 font-semibold rounded-lg text-lg hover:bg-blue-500 hover:text-white transform transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <Trophy className="inline-block w-5 h-5 mr-2" />
              Join Contest
            </NavLink>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                500+
              </div>
              <div className="text-gray-400">Coding Problems</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-blue-500 mb-2">50K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-purple-500 mb-2">1K+</div>
              <div className="text-gray-400">Companies Hiring</div>
            </div>
          </div>
        </div>
      </div>
      {/* Header with icon */}
      <div className="absolute -rotate-15 top-30 right-35 floating-card flex items-center justify-center pt-6 pb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg">
          <Users className="w-20 h-20 text-rose-400 group-hover:text-cyan-300 transition-colors duration-300" />
        </div>
      </div>
      <div className="absolute top-60 rotate-15 right-20 floating-card flex items-center justify-center pl-6 pb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg">
          <Code2 className="w-20 h-20 text-gray-400 group-hover:text-cyan-300 transition-colors duration-300" />
        </div>
      </div>
      <div className="absolute top-80 -rotate-5 right-33 floating-card flex items-center justify-center pr-6 pb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg">
          <Trophy className="w-20 h-20 text-orange-400 group-hover:text-cyan-300 transition-colors duration-300" />
        </div>
      </div>
      <div className="absolute top-70 left-35 rotate-15 floating-card flex items-center justify-center pt-6 pb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg">
          <CalendarHeart className="w-20 h-20 text-blue-500 group-hover:text-cyan-300 transition-colors duration-300" />
        </div>
      </div>
      <div className="absolute top-100 left-10 -rotate-15 floating-card flex items-center justify-center pl-6 pb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg">
          <Brain className="w-20 h-20 text-purple-300 group-hover:text-cyan-300 transition-colors duration-300" />
        </div>
      </div>
      <div className="absolute top-120 left-33 rotate-5 floating-card flex items-center justify-center pr-6 pb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg">
          <TrendingUp className="w-20 h-20 text-green-400 group-hover:text-cyan-300 transition-colors duration-300" />
        </div>
      </div>
    </section>
  );
};
