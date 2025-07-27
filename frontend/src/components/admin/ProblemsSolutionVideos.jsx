import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Loader2, TagIcon, Upload, Trash2 } from "lucide-react";
import { getAllVideoSolution } from "../../features/problem/problemThunks";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import UploadImage from "./UploadImage";
import { setShowCreateModal } from "../../features/ui/uiSlice";

function ProblemsSolutionVideos() {
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [minDuration, setMinDuration] = useState(0);
  const { solutionVideos, loading, error } = useSelector(
    (state) => state.problems
  );
  const { showCreateModal } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleDeleteVideo = async (problemId) => {
    if (
      window.confirm("Are you sure you want to delete this video solution?")
    ) {
      try {
        await axiosClient.delete(`/video/${problemId}`);
        toast.success("Video deleted successfully");

        dispatch(getAllVideoSolution());
      } catch (err) {
        console.error("Delete error", err);
        toast.error("Failed to delete video");
      }
    }
  };

  const filteredVideos = solutionVideos?.filter((video) => {
    const matchesTitle = video?.problemId?.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDifficulty = difficulty
      ? video?.problemId?.difficulty === difficulty
      : true;
    const matchesTag = tagFilter
      ? video?.problemId?.tags?.toLowerCase().includes(tagFilter.toLowerCase())
      : true;
    const matchesDuration = video?.duration >= minDuration;
    return matchesTitle && matchesDifficulty && matchesTag && matchesDuration;
  });

  if (loading && solutionVideos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading submissions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex  items-center justify-center h-[80%] rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-500 text-xl">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral/5">
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-6 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          type="text"
          placeholder="Search by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          min={0}
          placeholder="Search by duration (s)"
          value={minDuration === 0 ? "" : minDuration}
          onChange={(e) => setMinDuration(Number(e.target.value || 0))}
          className="p-2 border rounded"
        />
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : filteredVideos?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No videos found with current filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <div
                key={video?._id}
                className="bg-white dark:bg-gray-700/10 border dark:border-white/10 border-black/10 w-full md:max-w-90 rounded-xl shadow hover:shadow-md overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-video">
                  <div>
                    <video
                      src={video.secureUrl}
                      alt="Video Thumbnail"
                      className="w-full h-full max-h-100 md:h-50 object-cover"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                    {video?.duration?.toFixed(2)}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-medium border capitalize ${getDifficultyColor(
                        video?.problemId?.difficulty
                      )}`}
                    >
                      {video?.problemId?.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-2 md:mb-3">
                    {video?.problemId?.title}
                  </h3>
                  <div className="flex justify-between gap-1 py-1 flex-wrap text-gray-500 dark:text-gray-400">
                    {video?.problemId?.tags
                      ?.split(",")
                      .slice(0, 2)
                      .map((tag, i) => (
                        <div
                          key={i}
                          className="text-xs flex items-center justify-center text-gray-500 dark:text-black/70 gap-1 font-medium px-1 py-0.5 bg-gray-100 dark:bg-gray-300  rounded"
                        >
                          <TagIcon size={11} />
                          <div className="pb-0.5 capitalize">
                            {tag?.trim()}
                          </div>
                        </div>
                      ))}
                    <div className="flex items-center text-xs gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(video?.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-1 rounded-lg py-1">
                    <div
                      onClick={() => {
                        dispatch(setShowCreateModal(true));
                        setSelectedProblemId(video?.problemId?._id);
                      }}
                      className="btn btn-dash btn-primary font-medium h-8"
                    >
                      <Upload className="w-4 h-4" />
                      Thumbnail
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(video?.problemId?._id)}
                      className="btn btn-dash btn-error hover:text-white h-8 font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={!!showCreateModal}
        onClose={() => {
          dispatch(setShowCreateModal(false));
        }}
        title="Upload Thumbnail"
        size="xl"
      >
        {showCreateModal && <UploadImage problemId={selectedProblemId} />}
      </Modal>
    </div>
  );
}

export default ProblemsSolutionVideos;
