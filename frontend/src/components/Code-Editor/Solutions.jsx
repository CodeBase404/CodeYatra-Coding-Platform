import { Check, Code2, Copy, XCircle } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

function Solutions() {
  const { problem, loading, error } = useSelector((state) => state.problems);
  const [isCodeCopied, setIsCodeCopied] = useState(false);

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
    <div className="bg-white dark:bg-neutral-900/50 px-1 pb-1">
      <div className="flex items-center gap-3 px-2 py-4 ">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Implementation Details
        </h3>
      </div>

      {/* Code Block */}

      {problem?.referenceSolution?.map((p, index) => (
        <div
          key={index}
          className="relative mb-6 border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-8 py-4 bg-gray-900 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 font-medium capitalize">
                {p.language}
              </span>
            </div>
          </div>

          <div className="relative ">
            <SyntaxHighlighter
              language={p.language}
              style={codeTheme}
              customStyle={{
                margin: 0,
                padding: "2rem",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              {p.completeCode}
            </SyntaxHighlighter>
            <button
              onClick={() => {
                navigator.clipboard.writeText(p.completeCode);
                setIsCodeCopied(true);
                setTimeout(() => setIsCodeCopied(false), 2000);
              }}
              className="absolute top-1 right-2 flex flex-row items-center justify-center w-22 gap-1.5 px-2 py-2 bg-blue-600 dark:bg-gray-400/50 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
            >
              {isCodeCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Solutions;
