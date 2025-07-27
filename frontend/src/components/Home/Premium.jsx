import React from "react";
import { Crown, Zap, Target, BookOpen, Star, Check } from "lucide-react";
import { NavLink } from "react-router";

const PremiumDetails = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-black/30 dark:to-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock Your Full Potential
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Take your coding skills to the next level with our premium features
            designed for serious coders
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  AI-Powered Hints & Solutions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get intelligent hints and step-by-step explanations powered by
                  advanced AI to help you learn faster
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Personalized Learning Path
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Customized problem recommendations based on your skill level
                  and career goals
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Exclusive Content & Early Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access premium problems, mock interviews, and new features
                  before anyone else
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Priority Support & Community
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get direct access to our expert team and join an exclusive
                  community of top coders
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Premium Plan
                </h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $19
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Everything you need to ace your next interview
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited problem access",
                  "AI-powered hints & solutions",
                  "Mock interview sessions",
                  "Personalized learning path",
                  "Exclusive community access",
                  "Early feature access",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <NavLink to="/plans" className="block items-center text-center w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                 Goto Buy Premium
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumDetails;
