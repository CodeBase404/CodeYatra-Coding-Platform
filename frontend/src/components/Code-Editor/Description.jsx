import { useDispatch, useSelector } from "react-redux";
import { MessageCircle, Tag, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProblemLikeSection from "./ProblemLikeSection";
import FavoriteButton from "./FavoriteButton";
import { useEffect } from "react";
import { fetchFavorites } from "../../features/problem/problemThunks";
import CommentSection from "./CommentSection";
import { useState } from "react";

function Description() {
  const { problem, loading, error } = useSelector((state) => state.problems);
  const dispatch = useDispatch();
const [showComments, setShowComments] = useState(false);


  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-400/10 ";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 ";
      case "hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (loading && !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="flex  items-center justify-center h-full rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-500">
          <XCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mb-3 px-5">
        <h1 className="text-2xl font-medium text-black dark:text-white">
          {problem?.title}
        </h1>
      </div>
      <div className="flex items-center gap-2 mb-2 px-5">
        {problem?.difficulty && (
          <div
            className={` px-2 py-1 font-semibold rounded text-[12px] ${getDifficultyColor(
              problem?.difficulty
            )}`}
          >
            {problem?.difficulty.charAt(0).toUpperCase() +
              problem?.difficulty.slice(1)}
          </div>
        )}
        {problem?.tags && (
          <div className="flex gap-0.5 items-center px-2 py-1 font-bold bg-gray-400/20 text-gray-400 rounded text-[12px]">
            <Tag size={12} />
            {problem?.tags.charAt(0).toUpperCase() + problem.tags.slice(1)}
          </div>
        )}
      </div>

      <div className="prose prose-invert max-w-none pb-5 px-5">
        <div className="text-black/90 dark:text-gray-50">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {problem?.description}
          </ReactMarkdown>
        </div>

        {Array.isArray(problem?.visibleTestCases) &&
          problem?.visibleTestCases.map((example, index) => (
            <div key={example?._id} className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-black/90 dark:text-white/90">
                Example {index + 1}:
              </h3>
              <div className="bg-gray-100/40 border border-black/10 shadow dark:bg-slate-100/5 text-black/70 dark:text-white/50 p-4 rounded-md">
                <p>
                  <strong className="text-black/80 dark:text-white font-bold">
                    Input:
                  </strong>
                  <span className="text-[15px]"> {example?.input}</span>
                </p>
                <p>
                  <strong className="text-black/80 dark:text-white font-bold">
                    Output:
                  </strong>
                  <span className="text-[15px]"> {example?.output}</span>
                </p>
                <p>
                  <strong className="text-black/80 dark:text-white font-bold">
                    Explaination:
                  </strong>
                  <span className="text-[15px]"> {example?.explanation}</span>
                </p>
              </div>
            </div>
          ))}
      </div>
        {showComments && <CommentSection problemId={problem?._id} />}
      <div className="flex w-full py-2 items-center gap-3 fixed bottom-3 px-6">
        <ProblemLikeSection />
        <FavoriteButton problemId={problem?._id} />
        <div
          onClick={() => setShowComments((prev) => !prev)}
          className="flex text-black text-sm gap-1 items-center bg-white/10 px-1 py-0.5 border border-white/10 rounded-md cursor-pointer"
        >
          <MessageCircle className="h-5 w-5 text-black/50 dark:text-white/40" />
        </div>
      </div>
    </div>
  );
}

export default Description;
