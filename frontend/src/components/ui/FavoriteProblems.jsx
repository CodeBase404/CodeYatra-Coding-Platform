import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { Calendar, ExternalLink, Heart, Star, Tag, Users } from "lucide-react";
import { useNavigate } from "react-router";
import FavoriteButton from "../Code-Editor/FavoriteButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../features/problem/problemThunks";
import { removeFavoriteLocally } from "../../features/problem/problemsSlice";

const FavoriteProblems = () => {
  const { favProblems, loading } = useSelector((state) => state.problems);
  
  const navigate = useNavigate();
  const dispatch= useDispatch();

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        <p className="ml-3 text-gray-600 dark:text-white">Loading favorites...</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 px-1 py-0.5 rounded border border-black/10 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-yellow-100 px-1 py-0.5 rounded border border-black/10 text-yellow-800 hover:bg-yellow-200";
      case "hard":
        return "bg-red-100 px-1 py-0.5 rounded border border-black/10 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 px-1 py-0.5 rounded border border-black/10 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-100 rounded-lg">
          <Heart className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Favorite Problems
          </h2>
          <p className="text-gray-600 dark:text-white/80">
            Your collection of starred coding challenges
          </p>
        </div>
      </div>

      {favProblems?.length === 0 ? (
        <div className="border-dashed border-2 border-gray-200 px-3 rounded-2xl">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-gray-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 dark:text-white/80 text-center max-w-sm">
              Start exploring problems and click the heart icon to add them to
              your favorites.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 max-h-150 overflow-y-scroll">
          {favProblems?.map((problem) => (
            <div
              key={problem?._id}
              onClick={() => navigate(`/problems/${problem?._id}`)}
              className="group hover:shadow-lg h-28 border bg-white dark:bg-white/3 border-black/10 dark:border-white/10 rounded-md transition-all duration-200 border-l-4 border-l-blue-500 dark:border-l-blue-500"
            >
              <div className="px-6 py-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {problem?.title}
                    </h3>
                  </div>
                  <button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      variant="secondary"
                      className={`${getDifficultyColor(
                        problem?.difficulty
                      )} font-medium capitalize`}
                    >
                      {problem?.difficulty}
                    </div>

                    <div className="flex items-center gap-1 px-1 bg-green-100 p-1 rounded border border-black/10 text-green-800 hover:bg-green-200">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <div className="flex gap-1 flex-wrap">
                        {problem?.tags?.split(",").map((tag, index) => (
                          <div
                            key={index}
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {tag?.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div onClick={(e)=>e.stopPropagation()}>
                  <FavoriteButton problemId={problem?._id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteProblems;
