import { useEffect, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Share,
  Code,
  Link,
  AtSign,
  MoreHorizontal,
} from "lucide-react";
import { useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";

const CommentSection = ({ problemId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showRepliesMap, setShowRepliesMap] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [sortBy, setSortBy] = useState("Best");

  const user = useSelector((state) => state.auth.user);

  console.log(comments);

  const fetchComments = async () => {
    try {
      const res = await axiosClient.get(`/comments/${problemId}`);
      const data = res.data?.comments || [];

      const sortedComments = data
        .map((comment) => ({
          ...comment,
          votes:
            (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0),
          replies: comment.replies ?? [],
          userVote: comment.upvotes?.includes(user?._id)
            ? "up"
            : comment.downvotes?.includes(user?._id)
            ? "down"
            : null,
        }))
        .sort((a, b) => {
          if (sortBy === "Newest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } else if (sortBy === "Oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt);
          } else {
            // "Best" (default)
            return (
              (b.upvotes || 0) -
              (b.downvotes || 0) -
              ((a.upvotes || 0) - (a.downvotes || 0))
            );
          }
        });

      setComments(sortedComments); // ✅ valid inside the function
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handlePost = async () => {
    if (!newComment.trim()) return;
    try {
      await axiosClient.post(`/comments/${problemId}`, {
        content: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Post failed", err);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyContent.trim()) return;
    try {
      await axiosClient.post(`/comments/${commentId}/reply`, {
        content: replyContent,
      });
      setReplyingTo(null);
      setReplyContent("");
      fetchComments();
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  const handleVote = async (commentId, action) => {
    try {
      const res = await axiosClient.post(`/comments/${commentId}/vote`, {
        action,
      });
      console.log(res);

      fetchComments();
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  useEffect(() => {
    if (problemId) fetchComments();
  }, [problemId, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* New Comment Box */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type comment here..."
            className="w-full bg-transparent text-gray-300 placeholder-gray-500 resize-none outline-none text-lg min-h-[80px]"
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                <span>Choose a type</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-3">
                <button className="p-2 bg-gray-700 rounded hover:bg-gray-600">
                  <Code className="w-4 h-4 text-gray-300" />
                </button>
                <button className="p-2 bg-gray-700 rounded hover:bg-gray-600">
                  <Link className="w-4 h-4 text-gray-300" />
                </button>
                <button className="p-2 bg-gray-700 rounded hover:bg-gray-600">
                  <AtSign className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>
            <button
              onClick={handlePost}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Comment
            </button>
          </div>
        </div>

        {/* Sort Toggle */}
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
          >
            <option value="Best">Best</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-800 rounded-lg border border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 p-4 pb-0">
                <img
                  src={
                    comment.userId?.profileImage?.secureUrl ||
                    "/default-avatar.png"
                  }
                  alt={comment.userId?.firstName || "User"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <span className="font-semibold text-white">
                    {comment.userId?.firstName || "Unknown"}
                  </span>
                  <div className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-3">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleVote(comment._id, "upvote")}
                      className={`p-1 rounded ${
                        comment.userVote === "up"
                          ? "text-orange-500 bg-orange-500/10"
                          : "text-gray-400 hover:text-orange-500 hover:bg-orange-500/10"
                      }`}
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-300 min-w-[3rem] text-center">
                      {comment?.votes}
                    </span>
                    <button
                      onClick={() => handleVote(comment._id, "downvote")}
                      className={`p-1 rounded ${
                        comment.userVote === "down"
                          ? "text-blue-500 bg-blue-500/10"
                          : "text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowRepliesMap((prev) => ({
                        ...prev,
                        [comment._id]: !prev[comment._id],
                      }));
                    }}
                    className="flex items-center space-x-2 text-gray-400 hover:text-gray-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="flex text-sm">
                      {comment.replies.length} Replies{" "}
                      <ChevronDown
                        className={`transition-transform duration-300 ${
                          showRepliesMap[comment._id]
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                      />
                    </span>
                  </button>

                  <button
                    className="text-gray-400 hover:text-gray-300 text-sm"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )
                    }
                  >
                    Reply
                  </button>
                </div>
              </div>

              {/* Reply Box */}
              {replyingTo === comment._id && (
                <div className="border-t border-gray-700 p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={
                        user?.profileImage?.secureUrl || "/default-avatar.png"
                      }
                      className="w-8 h-8 rounded-full"
                      alt="Current user"
                    />
                    <div className="flex-1">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type reply here..."
                        className="w-full bg-gray-700 text-gray-200 placeholder-gray-500 rounded-lg p-3 resize-none border border-gray-600"
                      />
                      <div className="flex items-center justify-end space-x-3 mt-3">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReply(comment._id)}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Replies */}
              {showRepliesMap[comment._id] && comment.replies?.length > 0 && (
                <div className="px-6 pb-4 space-y-4">
                  {comment.replies.map((reply, index) => (
                    <div
                      key={index}
                      className="ml-6 border-l-[2px] border-gray-700 pl-4"
                    >
                      <div className="flex items-center gap-3 text-sm text-gray-300 mb-1">
                        <img
                          src={reply.userId?.profileImage?.secureUrl}
                          alt="avatar"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <strong>{reply.userId?.firstName || "User"}</strong>
                        <span className="text-xs text-gray-400">
                          • {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed ml-9">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
