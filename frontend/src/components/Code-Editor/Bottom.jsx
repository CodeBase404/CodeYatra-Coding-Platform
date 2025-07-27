import {
  Dot,
  SquareCheck,
  Terminal,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelected } from "../../features/ui/uiSlice";
import FullScreen from "../ui/FullScreen";

function Bottom() {
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const { problem, solutionRun, loading, loadings, error } = useSelector(
    (state) => state.problems
  );
  const { selected } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const bottomRef = useRef();

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-500 border-green-200";
      case "Wrong Answer":
        return "text-red-500 border-red-200";
      case "Error":
        return "text-yellow-500 border-yellow-200";
      case "Pending":
        return "text-blue-500 border-blue-200";
      default:
        return "text-gray-500 border-gray-200";
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
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
    <div ref={bottomRef} className="overflow-auto  h-full scrollbar-hide  group">
      <div className="sticky top-0 z-5 flex overflow-auto scrollbar-hide border-b border-black/5 dark:border-white/5  bg-white dark:bg-[#2d2d2d]">
        <Tabdiv
          active={selected === "testCases"}
          onClick={() => dispatch(setSelected("testCases"))}
          icon={<SquareCheck size={17} />}
          label="Test Cases"
        />
        <Tabdiv
          active={selected === "testResult"}
          onClick={() => dispatch(setSelected("testResult"))}
          icon={<Terminal size={21} />}
          label={"Test Result"}
          loading={loading && loadings.run && selected === "testResult"}
        />
        <FullScreen eleRef={bottomRef} />
      </div>

      <div className="flex-1 h-[100%] overflow-y-auto scrollbar-hide bg-white dark:bg-neutral-800/70">
        {selected === "testCases" && problem?.visibleTestCases?.length > 0 && (
          <div className="text-slate-400 p-2 text-sm">
            {/* Case Tabs */}
            <div className="flex space-x-2 mb-2 font-semibold">
              {problem.visibleTestCases.map((_, index) => (
                <Tabdiv
                  key={index}
                  active={selectedTestCase === index}
                  onClick={() => setSelectedTestCase(index)}
                  label={`Case ${index + 1}`}
                  Cases
                />
              ))}
            </div>

            {problem.visibleTestCases[selectedTestCase] && (
              <div className="ml-1">
                <div className="font-semibold text-black/50 dark:text-white/50 pl-1">
                  Input:
                </div>{" "}
                <div className="mt-2 space-y-1 text-black/80 dark:text-white border border-black/10 dark:border-gray-400/8 bg-gray-200/20 dark:bg-black/10 p-3.5 rounded-lg">
                  {problem.visibleTestCases[selectedTestCase]?.input}
                </div>
              </div>
            )}
          </div>
        )}

        {selected === "testResult" && problem?.visibleTestCases?.length > 0 && (
          <div className="text-slate-400 p-2 text-sm h-full mb-35">
            {solutionRun.length > 0 ? (
              <>
                <div className="flex items-center justify-between gap-4 ml-1.5 mb-3">
                  <div
                    className={`text-green-500 text-2xl space-x-2 ${getStatusColor(
                      solutionRun[selectedTestCase]?.statusDesc
                    )} font-semibold`}
                  >
                    {solutionRun[selectedTestCase]?.statusDesc}
                  </div>
                  <div className="gap-4">
                    <div className="text-[16px] pt-0.5 text-white/50">
                      <span>Runtime : </span>
                      <span className="text-sm font-semibold">
                        {Number(solutionRun[selectedTestCase]?.time).toFixed(2)}{" "}
                        sec
                      </span>
                    </div>
                    <div>
                      <span>Memory : </span>
                      {formatMemory(solutionRun[selectedTestCase]?.memory)}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-3 font-semibold">
                  {problem.visibleTestCases.map((_, index) => (
                    <Tabdiv
                      key={index}
                      active={selectedTestCase === index}
                      onClick={() => setSelectedTestCase(index)}
                      label={
                        <div className="flex items-center justify-center ">
                          <Dot className="text-green-500" />
                          Case {index + 1}
                        </div>
                      }
                      ResultCases
                    />
                  ))}
                </div>

                {problem.visibleTestCases[selectedTestCase] && (
                  <>
                    <div className="ml-1 mb-4">
                      <div className="font-semibold text-black/50 dark:text-white/50  pl-1">
                        Input:
                      </div>{" "}
                      <div className="mt-2 space-y-1  text-black/80 dark:text-white border border-black/10 dark:border-gray-400/8 bg-gray-200/20 dark:bg-black/10 p-3.5 rounded-lg">
                        {solutionRun[selectedTestCase]?.stdin}
                      </div>
                    </div>
                    <div className="ml-1 mb-4">
                      <div className="font-semibold text-black/50 dark:text-white/50 pl-1">
                        Output:
                      </div>{" "}
                      <div className="mt-2 space-y-1  text-black/80 dark:text-white border border-black/10 dark:border-gray-400/8 bg-gray-200/20 dark:bg-black/10 p-3.5 rounded-lg">
                        {solutionRun[selectedTestCase]?.stdout ?? "null"}
                      </div>
                    </div>
                    <div className="ml-1 mb-4">
                      <div className="font-semibold text-black/50 dark:text-white/50 pl-1">
                        Expected:
                      </div>{" "}
                      <div className="mt-2 space-y-1  text-black/80 dark:text-white border border-black/10 dark:border-gray-400/8 bg-gray-200/20 dark:bg-black/10 p-3.5 rounded-lg">
                        {solutionRun[selectedTestCase]?.expected_output}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : loading && loadings.run ? (
              <div className="flex w-full flex-col gap-2 p-1">
                <div className="flex justify-between my-1 w-full">
                  <div className="skeleton h-12 w-70 bg-white/10"></div>
                  <div className="skeleton h-12 w-65 bg-white/10"></div>
                </div>
                <div className="flex gap-4 mb-1">
                  <div className="skeleton h-10 w-25 bg-white/10"></div>
                  <div className="skeleton h-10 w-25 bg-white/10"></div>
                </div>
                <div className="skeleton h-7 w-20 bg-white/10"></div>
                <div className="skeleton h-14 w-full bg-white/10"></div>
                <div className="skeleton h-7 w-20 bg-white/10"></div>
                <div className="skeleton h-14 w-full bg-white/10 mb-5"></div>
              </div>
            ) : (
              <div className="text-yellow-400 h-full flex items-center justify-center text-base font-medium py-4">
                ⚠️ You must run your code first.
              </div>
            )}
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
  Cases,
  ResultCases,
  loading,
}) => {
  return (
    <div
      onClick={onClick}
      className={`px-2 ${
        Cases && "px-3"
      } ml-1 py-1.5  flex m-1 items-center hover:bg-gray-100 dark:hover:bg-white/8 hover:rounded-lg gap-1 select-none ${
        active
          ? `text-black dark:text-white font-medium  ${
              ResultCases && "pl-0 pr-4"
            } ${
              (Cases || ResultCases) && "bg-black/5 dark:bg-white/10 rounded-lg"
            }`
          : `text-black/30 dark:text-white/30 cursor-pointer hover:text-black dark:hover:text-white ${
              ResultCases && "pl-0 pr-4"
            }`
      }`}
    >
      <span className={` ${active ? "text-green-500" : "text-green-600/50"}`}>
        {loading ? (
          <span className="loading loading-spinner loading-sm text-green-500"></span>
        ) : (
          icon
        )}
      </span>
      <span>{label}</span>
    </div>
  );
};
export default Bottom;
