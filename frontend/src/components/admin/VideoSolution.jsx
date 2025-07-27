import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Hash,
  Tag,
  Target,
  Upload,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../ui/Modal";
import { useState } from "react";
import UploadVideo from "./UploadVideo";
import ProblemsSolutionVideos from "./ProblemsSolutionVideos";
import { setShowCreateModal } from "../../features/ui/uiSlice";

function VideoSolution() {
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { problems } = useSelector((state) => state.problems);
  const { showCreateModal } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const selectedProblem = problems.find((p) => p._id === selectedProblemId);

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <CheckCircle2 className="w-4 h-4" />;
      case "medium":
        return <Clock className="w-4 h-4" />;
      case "hard":
        return <Target className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      <div className="text-slate-400 text-sm w-full space-y-8 mt-6 mx-auto h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Video Solutions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage coding problems video solutions
            </p>
          </div>
          <button
            onClick={() => dispatch(setShowCreateModal(true))}
            className="btn  btn-primary btn-dash hover:text-white"
          >
            <Upload className="h-4 w-4" />
            Upload Video
          </button>
        </div>

        <ProblemsSolutionVideos />
      </div>
      
      <Modal
        isOpen={!!showCreateModal}
        onClose={() => {
          dispatch(setShowCreateModal(false));
          setSelectedProblemId("");
        }}
        title="Problems Details -> Video Upload"
        size="xl"
      >
        {showCreateModal && (
          <>
            <div className="relative">
              <div
                className="w-[95%] mx-auto  bg-white border-2 border-gray-200 rounded-xl px-4 py-4 cursor-pointer transition-all duration-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Hash className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      {selectedProblem ? (
                        <>
                          <div className="font-semibold text-gray-900">
                            {selectedProblem?.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Problem selected
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-gray-400">
                            Choose a problem
                          </div>
                          <div className="text-sm text-gray-400">
                            Select from the dropdown
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Dropdown Options */}
              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  {problems?.map((problem) => (
                    <div
                      key={problem._id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                      onClick={() => {
                        setSelectedProblemId(problem?._id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {problem?.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            ID: {problem?._id}
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                            problem?.difficulty
                          )}`}
                        >
                          {getDifficultyIcon(problem?.difficulty)}
                          <span>
                            {problem?.difficulty?.charAt(0)?.toUpperCase() +
                              problem?.difficulty?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Problem Details Card */}
            {selectedProblem && (
              <div className="w-[95%] mx-auto bg-white border mt-1 border-gray-200 rounded-2xl p-6 shadow-sm animate-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-6">
                  {/* Problem Title */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedProblem.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Problem ID:
                        </span>
                        <code className="px-2 py-1 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                          {selectedProblemId}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Problem Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Difficulty */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${getDifficultyColor(
                            selectedProblem.difficulty
                          )}`}
                        >
                          {getDifficultyIcon(selectedProblem.difficulty)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            Difficulty
                          </div>
                          <div
                            className={`text-lg font-semibold ${
                              getDifficultyColor(
                                selectedProblem.difficulty
                              ).split(" ")[0]
                            }`}
                          >
                            {selectedProblem?.difficulty
                              .charAt(0)
                              ?.toUpperCase() +
                              selectedProblem?.difficulty?.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Tag className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-600 mb-2">
                            Tags
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedProblem.tags
                              .split(",")
                              .map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                >
                                  {tag?.trim()?.charAt(0)?.toUpperCase() +
                                    tag?.trim()?.slice(1)}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!selectedProblem ? (
              <div className="w-[96%] mx-auto text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Problem Selected
                </h3>
                <p className="text-gray-500">
                  Select a problem from to the dropdown above to upload the
                  video
                </p>
              </div>
            ) : (
              <UploadVideo problemId={selectedProblemId} />
            )}
          </>
        )}
      </Modal>
    </>
  );
}

export default VideoSolution;
