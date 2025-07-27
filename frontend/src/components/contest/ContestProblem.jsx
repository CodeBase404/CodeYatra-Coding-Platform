import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContestProblemsById,
} from "../../features/contest/contestThunks";
import { useNavigate, useParams } from "react-router";

function ContestProblem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contestId } = useParams();

  const { contestProblems } = useSelector(
    (state) => state.contests
  );

  useEffect(() => {
    dispatch(fetchContestProblemsById(contestId));
  }, [dispatch]);

  const handleProblemClick = (problemId) => {
    navigate(`/contest/${contestId}/problem/${problemId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "from-emerald-500 to-green-500";
      case "medium":
        return "from-amber-500 to-orange-500";
      case "hard":
        return "from-red-500 to-rose-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  return (
    <div className="min-h-screen pt-15 px-2">
      {/* Problems List */}
      <div className="bg-white dark:bg-neutral/50 mt-2 md:w-[90%] mx-auto rounded-3xl shadow-xl border border-gray-100 dark:border-gray-100/10 overflow-hidden h-full">
        <div className="p-6 border-b border-gray-100 dark:border-gray-100/15 dark:bg-blue-500/60">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Contest Problems</h3>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-100/10">
          {contestProblems.map((problem, index) => (
            <div
              key={problem._id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div
                onClick={() => {
                  handleProblemClick(problem._id);
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 dark:text-white rounded-xl flex items-center justify-center font-bold text-gray-600">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-1">
                      {problem.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r capitalize ${getDifficultyColor(
                          problem.difficulty
                        )} text-white`}
                      >
                        {problem?.difficulty}
                      </span>

                      <div className="flex gap-1">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md capitalize">
                          {problem.tags}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContestProblem;
