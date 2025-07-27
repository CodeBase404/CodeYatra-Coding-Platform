import {
  Braces,
  ChevronDown,
  ChevronUp,
  CloudUpload,
  Code2,
  LogIn,
  Play,
  RotateCw,
  Text,
  Volume2,
  VolumeX,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResultTab, setSelected } from "../../features/ui/uiSlice";
import {
  fetchLastSubmission,
  fetchSubmissionsById,
  runProblemById,
  submitProblemById,
} from "../../features/problem/problemThunks";
import triggerConfetti from "../../utils/Confetti";
import {
  setRunLoading,
  setSubmitLoading,
} from "../../features/problem/problemsSlice";
import FullScreen from "../ui/FullScreen";
import toast from "react-hot-toast";
import { markDailyChallengeSolved } from "../../features/dailyChallenge/dailyChallengeThunk";
import { NavLink, useLocation } from "react-router";
import { isSoundEnabled, playClapSound, toggleSound } from "../../utils/sound";

const languages = [
  { value: "java", label: "Java", category: "popular" },
  { value: "cpp", label: "C++", category: "system" },
  { value: "javascript", label: "JavaScript", category: "web" },
];

function Right({ problemId, contestId }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "javascript";
  });
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const { problem, lastSubmission, loadings, loading, error } = useSelector(
    (state) => state.problems
  );

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.ui.theme);
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const isDailyChallenge = location.pathname.includes("/daily-challenge");

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const getCodeKey = (problemId, language) =>
    `code-${user?._id}-${problemId}-${language}`;

  const handleEditorChange = (value) => {
    const val = value || "";
    setCode(val);
    localStorage.setItem(getCodeKey(problemId, language), val);
  };

  const handleFormatCode = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };
  const handleRetrieveLastSubmission = () => {
    if (
      lastSubmission?.problemId === problemId &&
      lastSubmission?.language === language &&
      lastSubmission?.code
    ) {
      setCode(lastSubmission.code);
      localStorage.setItem(
        getCodeKey(problemId, language),
        lastSubmission.code
      );
      editorRef.current?.setValue(lastSubmission.code);
    }
  };

  const handleResetCode = () => {
    const initialCode = problem?.startCode?.find(
      (sc) => sc.language === language
    )?.initialCode;
    if (initialCode !== undefined) {
      setCode(initialCode);
      localStorage.setItem(getCodeKey(problemId, language), initialCode);
      editorRef.current?.setValue(initialCode);
    }
  };

  useEffect(() => {
    if (language) {
      localStorage.setItem("language", language);
    }
  }, [language]);

  useEffect(() => {
    if (!problem || !language || !user) return;

    const savedCode = localStorage.getItem(getCodeKey(problemId, language));
    if (savedCode) {
      setCode(savedCode);
      return;
    }

    if (
      lastSubmission?.problemId === problemId &&
      lastSubmission?.language === language &&
      lastSubmission?.code
    ) {
      setCode(lastSubmission.code);
      return;
    }

    const initialCode = problem?.startCode?.find(
      (sc) => sc.language === language
    )?.initialCode;
    setCode(initialCode || "");
  }, [language, problem, lastSubmission, problemId, user]);

  useEffect(() => {
    if (problemId && language && user) {
      dispatch(fetchLastSubmission({ problemId, language }));
    }
  }, [problemId, language, user]);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const newValue = toggleSound();
    setSoundOn(newValue);
  };

  const handleRun = async () => {
    dispatch(setRunLoading(true));
    try {
      dispatch(setSelected("testResult"));
      const response = await dispatch(
        runProblemById({ code, language, problemId })
      ).unwrap();

      const anyAccepted = response.some(
        (result) => result.statusDesc?.toLowerCase() === "accepted"
      );

      if (anyAccepted) {
        triggerConfetti();
      }
    } catch (error) {
      const errorMessage =
        error?.message || error?.data?.message || "Submission failed";
      toast.error(errorMessage);
      console.error("Error while running code:", error);
    } finally {
      dispatch(setRunLoading(false));
    }
  };

  const handleSubmitCode = async () => {
    dispatch(setSubmitLoading(true));
    try {
      const data = await dispatch(
        submitProblemById({ code, language, contestId, problemId })
      ).unwrap();

      dispatch(fetchSubmissionsById(problemId));

      const verdict = data?.status;
      if (verdict === "accepted") {
        dispatch(setResultTab("Accepted"));
        triggerConfetti();
        playClapSound();

        if (isDailyChallenge) {
          dispatch(markDailyChallengeSolved(problemId));
        }
      } else if (verdict === "wrong answer") {
        dispatch(setResultTab("Wrong Answer"));
      } else {
        dispatch(setResultTab("Error"));
      }
    } catch (error) {
      const errorMessage =
        error?.message || error?.data?.message || "Submission failed";
      toast.error(errorMessage);

      console.error("Error submitting code:", error);
      dispatch(setResultTab("Error"));
    } finally {
      dispatch(setSubmitLoading(false));
    }
  };

  if (!language || (loading && !problem)) {
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
    <div ref={codeRef} className="relative h-full flex flex-col group">
      {/* Header */}
      <div className="relative p-1 flex text-sm items-center justify-between border-b border-black/10 dark:border-white/10 bg-white dark:bg-neutral-600/50">
        <div className="flex items-center gap-1.5 hover:bg-white/10 py-1.5 px-2.5 rounded-md">
          <Code2 size={20} className="text-green-500" />{" "}
          <span className="text-black dark:text-white font-semibold">Code</span>
        </div>
        <div className="flex items-center space-x-2 pr-2">
          <button
            onClick={handleToggleSound}
            className="flex-1 border rounded-lg px-3 py-1.5 flex items-center justify-center gap-1 text-sm font-medium bg-gradient-to-r from-purple-600/30 dark:from-purple-500/20 to-purple-500 dark:to-purple-500/20 border-purple-300 dark:border-purple-400/30 text-purple-50 dark:text-purple-100 hover:from-purple-500/40 hover:to-purple-800 dark:hover:from-purple-500/30 dark:hover:to-purple-500/30 transition-all duration-300"
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundOn ? "On" : "Off"}
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={handleRun}
                disabled={loadings.submit || loadings.run}
                className={`flex-1 border rounded-lg px-3 py-1.5 flex items-center justify-center gap-1 text-sm font-medium bg-gradient-to-r from-red-600/30 dark:from-red-500/20 to-pink-500/90 dark:to-pink-500/20 border-red-300 dark:border-red-400/30 text-red-50 dark:text-red-100 hover:from-red-500/40 hover:to-pink-500 dark:hover:from-red-500/30 dark:hover:to-pink-500/30 transition-all duration-300 ${
                  loadings.submit || loadings.run
                    ? "dark:opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {loadings.run ? (
                  <span className="loading loading-bars loading-md"></span>
                ) : (
                  <>
                    <Play size={18} /> <span>Run</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={loadings.submit || loadings.run}
                className={`flex-1 border rounded-lg px-3 py-1.5 flex items-center justify-center gap-1 text-sm font-medium bg-gradient-to-r from-green-600/30 dark:from-green-500/20 to-green-700 dark:to-green-500/20 border-green-500 dark:border-green-400/30 text-green-50 dark:text-green-100 hover:from-green-500/40 hover:to-green-800 dark:hover:from-green-500/30 dark:hover:to-green-500/30 transition-all duration-300 ${
                  loadings.submit || loadings.run
                    ? "dark:opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {loadings.submit ? (
                  <span className="loading loading-bars loading-md"></span>
                ) : (
                  <>
                    <CloudUpload size={18} /> <span>Submit</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="flex-1 border w-30 rounded-lg px-3 py-1.5 flex items-center justify-center gap-1 text-sm font-medium bg-gradient-to-r from-red-600/30 dark:from-red-500/20 to-pink-500/90 dark:to-pink-500/20 border-red-300 dark:border-red-400/30 text-red-50 dark:text-red-100 hover:from-red-500/40 hover:to-pink-500 dark:hover:from-red-500/30 dark:hover:to-pink-500/30 transition-all duration-300"
            >
              <LogIn size={16} /> <span>Log in</span>
            </NavLink>
          )}
        </div>
      </div>
      <div className="relative p-1 pr-11 flex items-center justify-between bg-white dark:bg-[#1E1E1E] border-b border-black/10 dark:border-white/10">
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex pl-3 pr-2 py-1 space-x-0.5 hover:bg-gray-100 dark:hover:bg-gray-100/10 text-sm text-gray-500 dark:hover:text-gray-50 dark:text-gray-200 rounded"
          >
            <span>
              {languages.find((lang) => lang.value === language)?.label}
            </span>
            <span className="pt-[3px]">
              {open ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
            </span>
          </button>

          {open && (
            <div
              className={`absolute mt-2 py-2 bg-white dark:bg-[#2d2d2d] shadow-lg rounded-lg z-50 px-2
              ${
                languages.length > 10
                  ? "grid-cols-3"
                  : languages.length > 5
                  ? "grid-cols-2"
                  : "grid-cols-1 w-26!"
              }
              grid gap-1 w-50 md:w-80 min-h-50 max-h-80 overflow-y-auto`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    setLanguage(lang.value);
                    setOpen(false);
                  }}
                  className={`px-3 py-1 text-sm text-left rounded hover:bg-gray-100 dark:hover:bg-[#3d3d3d] ${
                    language === lang.value
                      ? "bg-green-400/20 text-green-500 dark:bg-[#3d3d3d] font-semibold"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-x-1">
          <button
            onClick={handleFormatCode}
            title="Format Document"
            className="hover:text-black/70 dark:hover:text-white text-gray-400 cursor-pointer hover:bg-white/10 p-1 rounded"
          >
            <Text size={16} />
          </button>
          <button
            onClick={handleResetCode}
            title="Reset to Default Code"
            className="hover:text-black/70 dark:hover:text-white text-gray-400 p-1 cursor-pointer hover:bg-white/10 rounded"
          >
            <RotateCw size={16} />
          </button>
          <button
            onClick={handleRetrieveLastSubmission}
            title="Load Last Submission"
            className="hover:text-black/70 dark:hover:text-white text-gray-400 p-1 cursor-pointer hover:bg-white/10 rounded"
          >
            <Braces size={16} />
          </button>
        </div>
        <FullScreen eleRef={codeRef} showIcon={true} />
      </div>

      {/* Editor */}
      <div className="flex-1 h-[100%] overflow-auto">
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          theme={theme === "dark" ? "vs-dark" : "vs-light	"}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            mouseWheelZoom: true,
            formatOnPaste: false,
            formatOnType: false,
          }}
        />
      </div>
    </div>
  );
}

export default Right;
