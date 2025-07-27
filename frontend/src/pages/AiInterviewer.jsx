import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Play, User, Bot, Volume2 } from "lucide-react";
import Vapi from "@vapi-ai/web";

const INITIAL_PROMPT = "To start the interview, just say 'Hey, hello'.";

function AiInterviewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("idle");

  const vapiRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setIsConnected(true);
      setConnectionStatus("connected");
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsRecording(false);
      setConnectionStatus("idle");
    });

    vapi.on("speech-start", () => setIsRecording(true));
    vapi.on("speech-end", () => setIsRecording(false));

    vapi.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: message.role === "user" ? "user" : "ai",
            content: message.transcript,
          },
        ]);
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setConnectionStatus("error");
    });

    return () => vapi.stop();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {
    setConnectionStatus("connecting");
    try {
      await vapiRef.current?.start({
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an AI interviewer conducting a professional job interview. Ask thoughtful questions about the candidate's experience, skills, and goals. Keep responses concise and professional. Start with: "${INITIAL_PROMPT}"`,
            },
          ],
        },
        voice: {
          provider: "openai",
          voiceId: "nova",
        },
      });

      setMessages([
        {
          id: "1",
          type: "ai",
          content: INITIAL_PROMPT,
        },
      ]);
    } catch (error) {
      console.error("Failed to start interview:", error);
      setConnectionStatus("error");
    }
  };

  const endInterview = () => {
    vapiRef.current?.stop();
    setMessages([]);
    setConnectionStatus("idle");
  };

  const renderStatus = () => {
    const statusMap = {
      connected: { text: "Connected", color: "green" },
      connecting: { text: "Connecting...", color: "yellow" },
      error: { text: "Connection Error", color: "red" },
    };
    const status = statusMap[connectionStatus];
    return (
      status && (
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-${status.color}-300`}
        >
          <div className={`w-2 h-2 rounded-full bg-${status.color}-400`} />
          {status.text}
        </div>
      )
    );
  };

  return (
    <div className=" pt-10 lg:pt-7 min-h-screen w-full dark:bg-neutral text-white overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 min-h-screen w-full p-4">
           <div class="absolute inset-0 -z-10 h-full w-full bg-white dark:hidden bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      <div className="text-2xl btn btn-dash btn-error">Let's Start Interview</div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col md:flex-row pt-3 items-stretch justify-center gap-6 w-full max-w-4xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>

          {/* Interviewer */}
          <div className="relative flex flex-col items-center justify-center backdrop-blur-xl bg-rose-300/50 dark:bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/20 rounded-2xl p-6 md:min-h-80 w-full ">
            {isConnected && (
              <div className="absolute top-2 right-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">Live</span>
              </div>
            )}
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-rose-500/40 dark:from-rose-500/20 to-pink-500/40 dark:to-pink-500/20 border border-rose-500/30 flex items-center justify-center relative overflow-hidden"
                animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {isRecording && (
                  <motion.div
                    className="absolute w-full h-full rounded-full bg-rose-500/30"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                <Volume2 className="w-8 h-8 text-white/80 dark:text-rose-400 z-10" />
              </motion.div>
            </div>
            <div className="flex items-center gap-3 mb-4 text-pink-50 dark:text-pink-500 ">
              <Bot className="w-6 h-6" />
              <h2 className="text-xl font-semibold">AI Interviewer</h2>
            </div>
          </div>

          {/* User */}
          <div className="relative flex flex-col items-center justify-center backdrop-blur-xl bg-purple-300/50  dark:bg-purple-400/10 border border-black/20 dark:border-white/20 rounded-2xl p-6 md:min-h-80 w-full ">
            <div className="flex justify-center mb-6">
              <motion.div
                className={`w-32 h-32 rounded-full border flex items-center justify-center relative bg-gradient-to-r from-purple-500/40 dark:from-purple-500/10 to-purple-500/40 dark:to-purple-500/15 border-purple-500/30`}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8 text-white/80" />
                ) : (
                  <Mic
                    className={`w-8 h-8 ${
                      isConnected ? "text-green-400" : "dark:text-purple-400"
                    }`}
                  />
                )}
              </motion.div>
            </div>
            <div className="flex items-center gap-3 mb-4 text-purple-50 dark:text-purple-500">
              <User className="w-6 h-6" />
              <h2 className="text-xl font-semibold">User</h2>
            </div>
            <div className="absolute top-0 right-0">{renderStatus()}</div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="hidden md:flex w-full max-w-4xl backdrop-blur-3xl h-64 overflow-y-auto flex-col mt-2 dark:bg-white/10 p-4 rounded-xl border border-black/20 dark:border-white/20 dark:shadow-inner">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`my-2 p-3 rounded-xl max-w-[80%] ${
                msg.type === "user"
                  ? "bg-blue-600 text-white self-end"
                  : "bg-green-500/10 dark:bg-white/10 text-gray-700 dark:text-white self-start"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="relative z-50 flex items-center justify-center gap-4 mt-2">
          {!isConnected ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startInterview}
              disabled={connectionStatus === "connecting"}
              className="px-8 py-3 disabled:opacity-50 btn btn-dash btn-success border border-white/50 disabled:cursor-not-allowed font-semibold hover:text-white dark:hover:bg-green-400/10 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              {connectionStatus === "connecting"
                ? "Starting..."
                : "Start Interview"}
            </motion.button>
          ) : (
            <button
              onClick={endInterview}
              className="px-8 py-3  btn btn-error font-semibold text-white flex items-center gap-2 shadow-lg"
            >
              End Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiInterviewer;
