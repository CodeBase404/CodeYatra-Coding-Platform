import {
  CircleCheckBig,
  Search,
  RotateCcw,
  Edit,
  Tag,
  Calendar,
  Trash2,
  Upload,
  Target,
  Code,
  Trophy,
  Sparkles,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProblems,
  fetchSolvedProblems,
} from "../../features/problem/problemThunks";
import axiosClient from "../../utils/axiosClient";
import { deleteProblemFromStore } from "../../features/problem/problemsSlice";
import Modal from "./Modal";
import ProblemForm from "../admin/ProblemForm";
import FavoriteButton from "../Code-Editor/FavoriteButton";

function ProblemsList({
  showOnlySolved = false,
  onClose,
  descHideFromSidebar,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [descHide, setDescHide] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    difficulty: "all",
    tags: "all",
  });

  const path = location.pathname;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { problems, solvedProblems, loading, error } = useSelector(
    (state) => state.problems
  );

  useEffect(() => {
    dispatch(fetchAllProblems());
    if (user) dispatch(fetchSolvedProblems());
  }, [user, dispatch]);

  const filteredProblems = problems
    .filter((problem) => {
      const difficultyMatch =
        filters.difficulty === "all" ||
        problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();

      const tagsMatch =
        filters.tags === "all" ||
        problem.tags.toLowerCase() === filters.tags.toLowerCase();

      const isSolved = solvedProblems.some(
        (solved) => solved._id === problem._id
      );

      const effectiveStatus = showOnlySolved ? "solved" : filters.status;

      const statusMatch =
        effectiveStatus === "all" || (effectiveStatus === "solved" && isSolved);
      return difficultyMatch && tagsMatch && statusMatch;
    })
    .filter((problem) =>
      problem.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const resetFilters = () => {
    setFilters({ status: "all", difficulty: "all", tags: "all" });
    setSearchQuery("");
  };

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;

    try {
      await axiosClient.delete(`/problem/${problemId}`);
      dispatch(deleteProblemFromStore(problemId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !problems) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error && !problems) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <Target className="h-3 w-3" />;
      case "medium":
        return <Code className="h-3 w-3" />;
      case "hard":
        return <Trophy className="h-3 w-3" />;
      default:
        return <Sparkles className="h-3 w-3" />;
    }
  };

  return (
    <div className={`relative space-y-3 rounded-xl w-full`}>
      <div className="flex flex-row items-center justify-between gap-2 w-full">
        <div className="sticky top-0 flex gap-3 px-4 items-center text-gray-500/80 dark:text-white/50 border border-black/20 dark:border-gray-400/15 rounded-lg w-full">
          <Search />
          <input
            type="text"
            placeholder="Search Question"
            className="border py-3 border-none placeholder:text-black/50 dark:placeholder:text-white/40 outline-none w-[94%] "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-4 py-3 my-1 rounded-xl border border-black/20 dark:border-gray-400/15 transition-all duration-200 ${
            showFilter
              ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
              : "  text-slate-400"
          }`}
        >
          <Filter className="h-5 w-5" />
          <span className="hidden sm:inline">Filters</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              showFilter ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <div className="relative border border-black/15 rounded-lg">
        <section className="relative z-2 ">
          <div className="w-full mx-auto dark:border dark:border-gray-200/10 rounded-lg overflow-hidden shadow-lg animate-fadeInUp">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/10 border-b border-gray-200 dark:border-gray-200/15 text-left text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-wider">
                  <tr>
                    <th className="py-3"></th>
                    <th className="px-2 py-3">No.</th>
                    <th className="px-6 py-3">Problem</th>
                    <th className="px-6 py-3">Difficulty</th>
                    <th className="px-6 py-3">Tags</th>
                    {["/problemset", "/problems", "/user"].some((p) =>
                      path.startsWith(p)
                    ) && <th className="px-2 py-3">Bookmark</th>}

                    {user?.role === "admin" && path === "/admin" && (
                      <>
                        <th className="px-6 py-3">Created</th>
                        <th className="px-6 py-3">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems?.length > 0 ? (
                    filteredProblems?.map((problem, index) => {
                      const isSolved = solvedProblems?.some(
                        (solved) => solved._id === problem._id
                      );
                      return (
                        <tr
                          key={problem._id}
                          className="hover:bg-gray-100/70 dark:hover:bg-gray-100/5 transition-colors"
                        >
                          <td className="py-3 pl-3">
                            <div className={`font-bold flex items-center`}>
                              <div className="text-green-500">
                                {isSolved && <CircleCheckBig size={18} />}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-black/80 dark:text-gray-300">
                            <div>{index + 1}.</div>
                          </td>
                          <td className="px-6 py-4">
                            <NavLink
                              to={`/problems/${problem._id}`}
                              onClick={() => {
                                if (typeof onClose === "function") onClose();
                              }}
                            >
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                {problem.title}
                              </h3>
                              {!descHide && !descHideFromSidebar && (
                                <p
                                  className={`text-sm ${
                                    descHide ? "hidden" : "block"
                                  } hidden md:block text-gray-500 dark:text-gray-400/50 truncate max-w-md`}
                                >
                                  {problem.description}
                                </p>
                              )}
                            </NavLink>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg ${getDifficultyColor(
                                problem.difficulty
                              )} capitalize`}
                            >
                              {getDifficultyIcon(problem.difficulty)}
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                <Tag className="h-3 w-3 mr-1" />
                                {problem.tags}
                              </span>
                            </div>
                          </td>
                          {["/problemset", "/problems", "/user"].some((p) =>
                            path.startsWith(p)
                          ) && (
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                  <FavoriteButton problemId={problem?._id} />
                                </span>
                              </div>
                            </td>
                          )}
                          {user?.role === "admin" && path === "/admin" && (
                            <>
                              <td className="px-6 py-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(problem.createdAt)}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <NavLink
                                    to={`upload/${problem._id}`}
                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                                    title="Upload Video"
                                  >
                                    <Upload className="h-4 w-4" />
                                  </NavLink>

                                  <button
                                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                                    title="Edit Problem"
                                    onClick={() => {
                                      setSelectedProblemId(problem._id);
                                      setShowCreateModal(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteProblem(problem._id)
                                    }
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                    title="Delete Problem"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={user?.role === "admin" ? 7 : 5}>
                        <div className="text-center py-4 text-gray-500">
                          No problems found.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {/* Filter Panel */}

        {showFilter && (
          <div className="absolute top-0 right-0 z-50 md:w-130 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200">
            <div className="p-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-400" />
                  Filter Problems
                </h3>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-2 gap-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    {path !== "/user" && (
                      <option value="all">All Problems</option>
                    )}
                    <option value="solved">Solved Problems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    value={filters.difficulty}
                    onChange={(e) =>
                      setFilters({ ...filters, difficulty: e.target.value })
                    }
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tags
                  </label>
                  <select
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    value={filters.tags}
                    onChange={(e) =>
                      setFilters({ ...filters, tags: e.target.value })
                    }
                  >
                    <option value="all">All Tags</option>
                    <option value="array">Array</option>
                    <option value="string">String</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                </div>
                {!descHideFromSidebar && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Problem Description
                    </label>
                    <button
                      onClick={() => setDescHide(!descHide)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    >
                      {descHide ? "Show" : "Hide"}
                    </button>
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={!!showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedProblemId(null);
        }}
        title={
          <>
            <h1 className="text-3xl font-bold mb-2">Update Problem</h1>
            <p className="text-sm text-gray-500">
              Edit the problem details and test cases.
            </p>
          </>
        }
        size="xl"
      >
        {showCreateModal && (
          <ProblemForm
            editMode={true}
            problemId={selectedProblemId}
            setShowCreateModal={setShowCreateModal}
          />
        )}
      </Modal>
    </div>
  );
}

export default ProblemsList;
