import { useState } from "react";
import {
  Calendar,
  Clock,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Trophy,
  Zap,
  MemoryStick,
  TestTube,
  Code,
  Copy,
  Check,
} from "lucide-react";
import { useSelector } from "react-redux";
import Modal from "../ui/Modal";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function SubmissionHistory() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { submissions, loading, error } = useSelector(
    (state) => state.problems
  );
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      accepted: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-600/10",
        borderColor: "border-green-200 dark:border-green-500/5",
        label: "Accepted",
      },
      "wrong answer": {
        icon: XCircle,
        color: "text-red-600 dark:text-red-500/90",
        bgColor: "bg-red-50 dark:bg-red-500/10",
        borderColor: "border-red-200 dark:border-red-400/8",
        label: "Wrong Answer",
      },
      pending: {
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-200/10",
        borderColor: "border-orange-200 dark:border-orange-300/8",
        label: "Pending",
      },
      error: {
        icon: XCircle,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-400/10",
        borderColor: "border-purple-200 dark:border-purple-400/8",
        label: "Error",
      },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(selectedSubmission?.status) || {};
  const StatusIcon = statusConfig?.icon; 
  const isAccepted = selectedSubmission?.status === "accepted";
  const passRate =
    (selectedSubmission?.testCasesPassed / selectedSubmission?.testCasesTotal) *
    100;

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "wrong answer":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "wrong answer":
        return "bg-red-100 text-red-800 border-red-200";
      case "error":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: "bg-yellow-100 text-yellow-800",
      java: "bg-pink-100 text-pink-800",
      cpp: "bg-purple-100 text-purple-800",
    };
    return colors[language] || "bg-gray-100 text-gray-800";
  };

  if (loading && !submissions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading submissions...</span>
        </div>
      </div>
    );
  }

  if (error && !submissions) {
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
    <div className="space-y-4 h-full w-full">
      {submissions.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-start py-12 bg-gray-50 dark:bg-neutral-900/30">
          <div className="text-gray-500 mb-2">
            No submissions found for this problem
          </div>
          <p className="text-sm text-gray-400">
            Submissions will appear here once users start solving this problem
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-neutral-900/50 shadow-sm border border-gray-200 dark:border-gray-200/10">
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-900/50  text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white border-b  border-gray-200 dark:border-gray-100/20">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Language</th>
                    <th className="px-4 py-3 pl-10">Status</th>
                    <th className="px-4 py-3">Runtime</th>
                    <th className="px-4 py-3">Memory</th>
                    <th className="px-4 py-3">Test Cases</th>
                    <th className="px-4 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral/10 divide-y divide-gray-200 dark:divide-gray-600/30">
                  {submissions.map((submission, index) => (
                    <tr
                      key={submission._id}
                      onClick={() => setSelectedSubmission(submission)}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800/80 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLanguageColor(
                            submission.language
                          )}`}
                        >
                          {submission.language.charAt(0).toUpperCase() +
                            submission.language.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4">
                            {getStatusIcon(submission.status)}
                          </div>
                          <div
                            className={`flex px-2 py-1 text-xs text-center font-semibold rounded-full border ${getStatusColor(
                              submission.status
                            )}`}
                          >
                            {submission.status
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1 text-sm font-mono text-gray-900 dark:text-gray-300">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{submission.runtime.toFixed(3)}s</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1 text-sm font-mono text-gray-900 dark:text-gray-300">
                          <Database className="h-3 w-3 text-gray-400" />
                          <span>{formatMemory(submission.memory)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-mono">
                          <span
                            className={
                              submission.testCasesPassed ===
                              submission.testCasesTotal
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {submission.testCasesPassed}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            /{submission.testCasesTotal}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(submission.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Code View Modal */}
      <Modal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title={`Submission Details - ${
          selectedSubmission?.language.charAt(0).toUpperCase() +
          selectedSubmission?.language.slice(1)
        }`}
        size="xl"
      >
        {selectedSubmission && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-white/15 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(selectedSubmission?.createdAt)}
                  </span>
                </div>
                {isAccepted && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Trophy className="w-6 h-6" />
                    <span className="font-semibold">Solved!</span>
                  </div>
                )}
              </div>

              {/* Status Banner */}
              <div
                className={`rounded-lg border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} p-4 transition-all duration-200`}
              >
                <div
                  className={`flex items-center space-x-3 ${statusConfig.color}`}
                >
                  <StatusIcon className="w-6 h-6" />
                  <div>
                    <p className={`font-bold text-lg`}>{statusConfig.label}</p>
                    <p className="text-sm text-gray-600">
                      Submission ID: #{selectedSubmission?._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-blue-300/20 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-blue-400 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Performance Metrics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Runtime */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                      RUNTIME
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedSubmission?.runtime?.toFixed(0)}ms
                  </p>
                  <p className="text-sm text-blue-600 mt-1">Execution time</p>
                </div>

                {/* Memory */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <MemoryStick className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded-full">
                      MEMORY
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatMemory(selectedSubmission?.memory)}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">Memory usage</p>
                </div>

                {/* Test Cases */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <TestTube className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                      TESTS
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {selectedSubmission?.testCasesPassed}/
                    {selectedSubmission?.testCasesTotal}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${passRate}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      {passRate.toFixed(1)}% passed
                    </p>
                  </div>
                </div>

                {/* Language */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 ">
                  <div className="flex items-center justify-between mb-2">
                    <Code className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                      LANGUAGE
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {selectedSubmission?.language?.charAt(0)?.toUpperCase() +
                      selectedSubmission?.language?.slice(1)}
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    Programming language
                  </p>
                </div>
              </div>
            </div>

            {/* Code Display */}
            <div className="rounded-xl shadow-sm border border-gray-200 dark:border-yellow-200/15 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 dark:from-white/5  to-gray-100 dark:to-white/5 px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-green-300 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-gray-600 dark:text-green-200" />
                    Source Code
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 bg-gray-200 dark:bg-white/10 dark:text-gray-400 px-3 py-1 rounded-full capitalize">
                      {selectedSubmission?.language}
                    </span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 dark:bg-white/10 relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedSubmission?.code);
                    setIsCodeCopied(true);
                    setTimeout(() => setIsCodeCopied(false), 2000);
                  }}
                  className="absolute right-2 top-1.5 flex flex-row items-center justify-center w-10 gap-2 px-1 py-2 bg-rose-400/30 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  {isCodeCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
                {/* Line numbers and code */}
                <div className="flex">
                  <div className="bg-gray-800 dark:bg-black/40 px-4 py-4 border-r border-gray-700 select-none">
                    {selectedSubmission?.code.split("\n").map((_, index) => (
                      <div
                        key={index}
                        className="text-gray-400 text-sm font-mono leading-6"
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <SyntaxHighlighter
                      language={selectedSubmission?.language}
                      style={coldarkDark}
                      customStyle={{
                        margin: 0,
                        padding: "2rem",
                        fontSize: "16px",
                        lineHeight: "1.6",
                      }}
                    >
                      {selectedSubmission?.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SubmissionHistory;
