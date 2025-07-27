import React from "react";
import { Code, Trophy, Brain, TrendingUp, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Practice 500+ DSA Problems",
    description:
      "Master data structures and algorithms with carefully curated problems from easy to expert level.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Trophy,
    title: "Real-time Contests & Leaderboards",
    description:
      "Compete with coders worldwide in weekly contests and climb the global leaderboard.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "AI-powered Interview Preparation",
    description:
      "Get personalized interview questions and AI feedback to ace your technical interviews.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracker & Analytics",
    description:
      "Track your coding journey with detailed analytics and personalized learning paths.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Clock,
    title: "Daily Challenges",
    description:
      "Stay sharp with daily coding challenges and maintain your problem-solving streak.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Users,
    title: "Community Solutions",
    description:
      "Learn from the community with multiple solutions and detailed explanations for every problem.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white dark:bg-black/25 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources you
            need to master coding interviews and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-900/5 hover:bg-white dark:hover:bg-gray-900/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-200 dark:border-gray-700/40"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-6`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-orange-500 transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
