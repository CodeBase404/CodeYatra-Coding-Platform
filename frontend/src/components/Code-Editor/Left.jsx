import {
  BookOpen,
  ExternalLink,
  X,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Zap,
  MemoryStick,
  TestTube,
  Code,
  TvMinimalPlay,
  BotMessageSquare,
  History,
  BookCheck
} from "lucide-react";
import Editorial from "./Editorial";
import Description from "./Description";
import SubmissionHistory from "./SubmissionHistory";
import { clearResultTab, setSelectedTab } from "../../features/ui/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import ChatAi from "./ChatAi";
import Solutions from "./Solutions";
import { useRef, useState } from "react";
import FullScreen from "../ui/FullScreen";
import dayjs from "dayjs";
import { NavLink } from "react-router";

function Left({ problemId }) {
  const { selectedTab, resultTab } = useSelector((state) => state.ui);
  const { solutionSubmit, problem } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);

  const isPremiumActive =
    user?.premiumPlan?.isActive &&
    dayjs().isBefore(dayjs(user?.premiumPlan?.endDate));

  const leftRef = useRef();

  const dispatch = useDispatch();

  const handleTabChange = (tabName) => {
    dispatch(setSelectedTab(tabName));
  };

  const getStatusConfig = (status) => {
    const configs = {
      accepted: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Accepted",
      },
      "wrong answer": {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Wrong Answer",
      },
      pending: {
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        label: "Pending",
      },
      error: {
        icon: XCircle,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        label: "Error",
      },
    };

    return configs[status];
  };

  const statusConfig = getStatusConfig(solutionSubmit?.status) || {};

  const StatusIcon = statusConfig?.icon;
  const isAccepted = solutionSubmit?.status === "accepted";
  const passRate =
    (solutionSubmit?.passedTestCases / solutionSubmit?.totalTestCases) * 100;

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

  return (
    <div
      ref={leftRef}
      className="overflow-auto h-full scrollbar-hide dark:border-white/10 group"
    >
      <div className="sticky top-0 z-10 flex h-11 overflow-auto scrollbar-hide border-b border-black/6 bg-white dark:bg-[#2d2d2d]">
        <Tabdiv
          active={selectedTab === "description"}
          onClick={() => handleTabChange("description")}
          icon={<BookOpen size={16} />}
          label="Description"
        />
        <Tabdiv
          active={selectedTab === "editorial"}
          onClick={() => handleTabChange("editorial")}
          icon={<TvMinimalPlay  size={16} />}
          label="Editorial"
        />
        <Tabdiv
          active={selectedTab === "solutions"}
          onClick={() => handleTabChange("solutions")}
           icon={<BookCheck   size={16} />}
          label="Solutions"
        />
        <Tabdiv
          active={selectedTab === "submissions"}
          onClick={() => handleTabChange("submissions")}
           icon={<History  size={16} />}
          label="Submissions"
        />
        <Tabdiv
          active={selectedTab === "AI"}
          onClick={() => handleTabChange("AI")}
           icon={<BotMessageSquare  size={16} />}
          label="AI"
        />
        {resultTab && (
          <Tabdiv
            active={selectedTab === resultTab}
            onClick={() => handleTabChange(resultTab)}
            label={resultTab}
            closable
            onClose={() => dispatch(clearResultTab())}
          />
        )}

        <FullScreen eleRef={leftRef} />
      </div>

      <div className="flex-1 h-full overflow-y-auto scrollbar-hide bg-white dark:bg-neutral-800/70">
        {selectedTab === "description" && <Description />}

        {selectedTab === "editorial" && (
          <div className="text-slate-400 text-sm flex items-center justify-center max-h-full w-full">
            {problem?.secureUrl ? (
              isPremiumActive ? (
                <Editorial
                  secureUrl={problem?.secureUrl}
                  thumbnailUrl={problem?.imageUrl || problem?.thumbnailUrl}
                  duration={problem?.duration}
                />
              ) : (
                <div className="w-full h-[250px] flex flex-col items-center justify-center bg-slate-100 border border-dashed border-gray-400 rounded-md p-4 text-center">
                  <p className="text-gray-600 mb-2 text-sm">
                    🚫 This video solution is available only for Premium users.
                  </p>
                  <p className="text-gray-500 mb-4 text-xs">
                    Upgrade your account to access video solutions for all
                    problems.
                  </p>
                  <NavLink
                    to="/plans"
                    className="px-4 py-1.5 text-sm rounded bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  >
                    View Premium Plans
                  </NavLink>
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 text-sm flex items-center justify-center w-full h-[100px]">
                🚫 No video solution available for this problem.
              </div>
            )}
          </div>
        )}

        {selectedTab === "solutions" && (
          <div className="text-slate-400 text-sm h-full">
            <Solutions />
          </div>
        )}

        {selectedTab === "submissions" && (
          <div className="text-slate-400 text-sm w-full h-full">
            <SubmissionHistory />
          </div>
        )}
        {selectedTab === "AI" && (
          <div className="text-slate-400 text-sm w-full flex justify-center">
            {isPremiumActive ? (
              <ChatAi problemId={problemId} />
            ) : (
              <div className="w-full h-[250px] flex flex-col items-center justify-center bg-slate-100 border border-dashed border-gray-400 rounded-md p-4 text-center">
                <p className="text-gray-600 mb-2 text-sm">
                  🤖 AI Assistant is available only for Premium users.
                </p>
                <p className="text-gray-500 mb-4 text-xs">
                  Get instant AI explanations, hints, and code suggestions for
                  any problem.
                </p>
                <button
                  onClick={() => navigate("/plans")}
                  className="px-4 py-1.5 text-sm rounded bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                >
                  View Premium Plans
                </button>
              </div>
            )}
          </div>
        )}

        {resultTab && selectedTab === resultTab && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(solutionSubmit?.createdAt)}
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
                className={`rounded-lg border-2 ${statusConfig?.borderColor} ${statusConfig?.bgColor} p-4 transition-all duration-200`}
              >
                <div
                  className={`flex items-center space-x-3  ${statusConfig?.color}`}
                >
                  <StatusIcon className="w-6 h-6" />
                  <div>
                    <p className={`font-bold text-lg`}>{statusConfig?.label}</p>
                    <p className="text-sm text-gray-600">
                      Submission ID: #{solutionSubmit?._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                    {solutionSubmit?.runtime?.toFixed(0)}ms
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
                    {formatMemory(solutionSubmit?.memory)}
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
                    {solutionSubmit?.passedTestCases}/
                    {solutionSubmit?.totalTestCases}
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
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <Code className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                      LANGUAGE
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {solutionSubmit?.language?.charAt(0)?.toUpperCase() +
                      solutionSubmit?.language?.slice(1)}
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    Programming language
                  </p>
                </div>
              </div>
            </div>

            {/* Code Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-gray-600" />
                    Source Code
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                      {solutionSubmit?.language?.charAt(0)?.toUpperCase() +
                        solutionSubmit?.language?.slice(1)}
                    </span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 relative">
                {/* Line numbers and code */}
                <div className="flex">
                  <div className="bg-gray-800 px-4 py-4 border-r border-gray-700 select-none">
                    {solutionSubmit?.code?.split("\n")?.map((_, index) => (
                      <div
                        key={index}
                        className="text-gray-400 text-sm font-mono leading-6"
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <pre className="p-4 text-sm font-mono leading-6">
                      <code className="text-gray-100 whitespace-pre">
                        {solutionSubmit?.code}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Tabdiv = ({
  active,
  onClick,
  icon,
  label,
  closable,
  onClose,
}) => {
  return (
    <div
      onClick={onClick}
      className={`px-2 py-2 flex m-1 items-center hover:bg-neutral/5  dark:hover:bg-[#3c3c3c] hover:text-gray-700 dark:hover:text-gray-300 hover:rounded-lg space-x-1.5 select-none ${
        active
          ? "text-black font-semibold dark:text-white hover:text-black! dark:hover:text-white!"
          : "text-black/40 dark:text-white/30 cursor-pointer"
      }`}
    >
      {icon}
      <span className={`text-sm ${label === "Wrong Answer" ? "w-24 " : ""}`}>
        {label}
      </span>

      {closable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="pt-1 p-0.5 hover:bg-black/10 dark:hover:bg-white/20 cursor-pointer rounded-md text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
export default Left;
