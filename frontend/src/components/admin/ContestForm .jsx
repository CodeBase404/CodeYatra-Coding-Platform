import { useState } from "react";
import { useForm } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Trophy,
  GripVertical,
  X,
  CheckCircle2,
  AlertCircle,
  Plus,
  Zap,
  Target,
  Star,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import { addContestToStore } from "../../features/contest/contestSlice";
import { setShowCreateModal } from "../../features/ui/uiSlice";

const ContestForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [selectedProblemIds, setSelectedProblemIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();

  const { problems, loading } = useSelector((state) => state.problems);

  const difficulties = ["easy", "medium", "hard"];
  const allTags = [...new Set(problems.flatMap((p) => p.tags))];

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      !difficultyFilter || p.difficulty === difficultyFilter;
    const matchesTag = !tagFilter || p.tags.includes(tagFilter);

    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const handleProblemToggle = (problemId) => {
    setSelectedProblemIds((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleSelectAll = () => {
    const allFiltered = filteredProblems.map((p) => p._id);
    const allSelected = allFiltered.every((id) =>
      selectedProblemIds.includes(id)
    );

    if (allSelected) {
      setSelectedProblemIds((prev) =>
        prev.filter((id) => !allFiltered.includes(id))
      );
    } else {
      setSelectedProblemIds((prev) => [...new Set([...prev, ...allFiltered])]);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(selectedProblemIds);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSelectedProblemIds(reordered);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedProblemIds.length === 0) {
        alert("Please select at least one problem for the contest");
        return;
      }
      const contestDetails = {
        ...data,
        problems: selectedProblemIds,
      };

      const res = await axiosClient.post("/contest/create", contestDetails);
      dispatch(addContestToStore(res.data.contest));
      alert("Contest created successfully!");
      dispatch(setShowCreateModal(false));
      reset();
      setSelectedProblemIds([]);
    } catch (error) {
      console.error("Contest creation failed:", error);
      alert("Error creating contest");
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return <Target className="w-4 h-4" />;
      case "medium":
        return <Zap className="w-4 h-4" />;
      case "hard":
        return <Star className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl h-full mx-auto p-6 space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-6 h-6 text-blue-600 mr-3" />
            Contest Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Name *
              </label>
              <input
                {...register("name", { required: "Contest name is required" })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200"
                }`}
                placeholder="Enter contest name (e.g., Weekly Challenge #1)"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.startTime
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.startTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  {...register("endTime", { required: "End time is required" })}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    errors.endTime
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.endTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Target className="w-6 h-6 text-blue-600 mr-3" />
              Select Problems
            </h2>
            <div className="text-sm text-gray-600">
              {selectedProblemIds.length} problems selected
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search problems by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 border-2 rounded-xl transition-all ${
                  showFilters
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Difficulties</option>
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>

                  <select
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {filteredProblems.length > 0 &&
                  filteredProblems.every((p) =>
                    selectedProblemIds.includes(p._id)
                  )
                    ? "Deselect All Filtered"
                    : "Select All Filtered"}
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading problems...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:max-h-[42vh] overflow-scroll md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredProblems.map((problem) => (
                <div
                  key={problem._id}
                  onClick={() => handleProblemToggle(problem._id)}
                  className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    selectedProblemIds.includes(problem._id)
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {getDifficultyIcon(problem.difficulty)}
                      <span className="ml-1">{problem.difficulty}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedProblemIds.includes(problem._id)
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedProblemIds.includes(problem._id) && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {problem?.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {problem.tags}
                    </span>
                    {problem?.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{problem?.tags?.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProblems.length === 0 && !loading && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No problems found matching your criteria
              </p>
            </div>
          )}
        </div>

        {selectedProblemIds.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <GripVertical className="w-5 h-5 text-blue-600 mr-2" />
              Problem Order ({selectedProblemIds.length} selected)
            </h3>
            <p className="text-gray-600 mb-6">
              Drag and drop to reorder problems
            </p>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="selectedProblems">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 min-h-[100px] p-4 border-2 border-dashed rounded-xl transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {selectedProblemIds.map((problemId, index) => {
                      const problem = problems.find((p) => p._id === problemId);
                      if (!problem) return null;

                      return (
                        <Draggable
                          key={problemId}
                          draggableId={problemId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center p-4 bg-white border border-gray-200 rounded-xl transition-all ${
                                snapshot.isDragging
                                  ? "shadow-lg rotate-2 scale-105"
                                  : "hover:shadow-md"
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>

                              <div className="flex-1 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full">
                                    #{index + 1}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {problem.title}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                                      problem.difficulty
                                    )}`}
                                  >
                                    {problem.difficulty}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleProblemToggle(problemId)}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    {selectedProblemIds.length === 0 && (
                      <div className="text-center py-8">
                        <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">
                          No problems selected yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || selectedProblemIds.length === 0}
            className={`flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              isSubmitting || selectedProblemIds.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Creating Contest...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 mr-3" />
                Create Contest
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContestForm;
