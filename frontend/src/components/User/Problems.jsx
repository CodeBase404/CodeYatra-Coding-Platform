import { Code2 } from "lucide-react";
import { useSelector } from "react-redux";
import ProblemsList from "../ui/ProblemsList";

function Problems() {
  const { solvedProblems } = useSelector((state) => state.problems);
  const totalSolved = solvedProblems.length;

  const difficultyStats = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  solvedProblems.forEach((problem) => {
    const diff = problem.difficulty?.toLowerCase();
    if (difficultyStats[diff] !== undefined) {
      difficultyStats[diff]++;
    }
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-white">Total Solved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white/50">{totalSolved}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Code2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {["easy", "medium", "hard"].map((level) => {
          const colors = {
            easy: {
              bg: "bg-green-100",
              text: "text-green-700",
              icon: "🟢",
            },
            medium: {
              bg: "bg-yellow-100",
              text: "text-yellow-700",
              icon: "🟡",
            },
            hard: {
              bg: "bg-red-100",
              text: "text-red-700",
              icon: "🔴",
            },
          };

          const color = colors[level];

          return (
            <div
              key={level}
              className={`bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-white/10`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-white capitalize">
                    {level} Problems
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white/50">
                    {difficultyStats[level]}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center`}
                >
                  <span className={`text-2xl ${color.text}`}>{color.icon}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ProblemsList showOnlySolved={true} />
    </div>
  );
}

export default Problems;
