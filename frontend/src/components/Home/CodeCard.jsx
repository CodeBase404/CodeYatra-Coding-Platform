import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { NavLink } from "react-router";

const codeSnippet = `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

char firstNonRepeatingChar(string str) {
  unordered_map<char, int> freq;
  for (char c : str) freq[c]++;
  for (char c : str) {
    if (freq[c] == 1) return c;
  }
  return '_';
}

int main() {
  string input;
  getline(cin, input);
  cout << firstNonRepeatingChar(input);
  return 0;
}`;

const CodeCard = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-black/30 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Practice with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Real Problems
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience our intuitive code editor with syntax highlighting and
              intelligent suggestions
            </p>
          </div>

          <div className="bg-white dark:bg-neutral/30 rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-gray-700">
            {/* Terminal Header */}
            <div className="flex items-center px-6 py-4 bg-white dark:bg-neutral/30 border-b border-black/10 dark:border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center pl-4 w-full justify-between text-center">
                <div className="text-gray-400 text-sm font-bold">
                  C++
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  Find the First Non-Repeating Character 
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="p-6">
              <SyntaxHighlighter
                language="cpp"
                style={coldarkDark}
                customStyle={{
                  margin: 0,
                  padding: "2rem",
                  fontSize: "16px",
                  lineHeight: "1.6",
                }}
              >
                {codeSnippet}
              </SyntaxHighlighter>
            </div>

            {/* Output Panel */}
            <div className="bg-white dark:bg-neutral/30 border-t border-black/10 dark:border-gray-700 px-6 py-4">
              <div className="text-green-400 text-sm font-mono">
                <div className="mb-1">✓ Test Case 1: Passed</div>
                <div className="mb-1">✓ Test Case 2: Passed</div>
                <div className="mb-1">✓ Test Case 3: Passed</div>
                <div className="text-orange-500 mt-2">
                  Runtime: 60ms | Memory: 42.1MB | Beats 85% of JavaScript
                  submissions
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <NavLink to="/problems/683db5aed3fc98ddef72626e" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg">
              Try This Problem
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeCard;
