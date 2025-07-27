import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Bot,
  Check,
  Copy,
  Mic,
  MicOff,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

function ChatAi({ problemId }) {
  const { problem, loading, error } = useSelector((state) => state.problems);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadChat = async () => {
      if (!problemId) return;

      setMessages([]); // Clear current chat

      try {
        const res = await axiosClient.get(`/chat/${problemId}`);

        if (res.data.success && res.data.chat[0]?.messages?.length) {
          const formattedMessages = res.data.chat[0].messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            content: m.parts?.[0]?.text || "",
          }));

          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
        setMessages([
          {
            role: "model",
            content: "⚠️ Failed to load this chat.",
          },
        ]);
      }
    };

    loadChat();
  }, [problemId]);

  const onSubmit = async (data) => {
    const trimmedInput = data.message.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedInput },
      { role: "model", content: "" },
    ]);
    reset();

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(`http://localhost:4000/chat/${problemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: trimmedInput,
          title: problem.title,
          description: problem.description,
          testCases: problem.visibleTestCases,
          startCode: problem.startCode,
        }),
        signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        for (let char of chunk) {
          await new Promise((resolve) => setTimeout(resolve, 5));
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "model") {
              last.content += char;
            }
            return [...updated.slice(0, -1), last];
          });
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Something went wrong while streaming." },
      ]);
    }
  };

  const handleDeleteChat = async () => {
    if (!problemId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axiosClient.delete(`/chat/${problemId}`);

      if (res.data.success) {
        setMessages([]); // Clear chat from UI
        toast.success("Chat deleted successfully");
      } else {
        toast.error("Failed to delete chat");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while deleting the chat.");
    }
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

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      console.log("Voice recognized:", transcript);

      // ✅ Set the input value without submitting
      setValue("message", transcript, { shouldValidate: true });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="flex flex-col h-screen max-h-[85vh]">
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "model" ? (
                <div className="w-full text-gray-800 dark:text-white rounded-2xl rounded-tl-md p-4 py-3 text-[16px] whitespace-pre-wrap">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeText = String(children).replace(/\n$/, "");

                        if (!inline && match) {
                          return (
                            <div className="relative">
                              <button
                                onClick={async () => {
                                  await navigator.clipboard.writeText(codeText);
                                  setIsCodeCopied(true);
                                  setTimeout(
                                    () => setIsCodeCopied(false),
                                    2000
                                  );
                                }}
                                className="absolute top-2 right-2 z-2 flex items-center gap-2 p-1.5 px-2 text-sm bg-gray-600 rounded transition-all"
                              >
                                {isCodeCopied ? (
                                  <>
                                    <Check className="w-4 h-4 text-green-500" />
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 text-gray-200" />
                                  </>
                                )}
                              </button>
                              <SyntaxHighlighter
                                style={codeTheme}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg mt-2"
                                {...props}
                              >
                                {codeText}
                              </SyntaxHighlighter>
                            </div>
                          );
                        } else {
                          return (
                            <code
                              className="bg-black/5 text-gray-500 dark:text-white dark:bg-white/10 px-1 py-0.5 rounded"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="max-w-[90%] bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md p-4 shadow-sm">
                  {msg.content}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Welcome to AI Assistant
                </h3>
                <p className="text-slate-500 text-sm max-w-md">
                  I'm here to help you with coding problems, explanations, and
                  guidance. Start by asking me anything!
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky bottom-0 p-2 border-t border-white/10"
      >
        <div className="flex items-center gap-1">
         
          <div
            onClick={handleDeleteChat}
            className="btn btn-primary btn-ghost border"
          >
            <Trash2 />
          </div>
          <textarea
            placeholder="Ask me anything"
            className="input input-bordered flex-1"
            {...register("message", { required: true, minLength: 2 })}
            autoFocus
            onInput={(e) => {
              const target = e.target;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px"; 
            }}
          />
           <button
            type="button"
            onClick={handleVoiceInput}
            className={`btn btn-ghost border ${
              isListening ? "btn-error" : "btn-primary"
            }`}
            title="Voice Input"
          >
            {isListening ? <MicOff /> : <Mic />}
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-ghost"
            disabled={errors.message}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
