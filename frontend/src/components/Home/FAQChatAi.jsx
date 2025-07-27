import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mic, MicOff, Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function FAQFAQChatAi() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    const userMessage = data.message.trim();
    if (!userMessage) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "model", content: "" },
    ]);
    reset();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/chat/faq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: userMessage }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setIsLoading(false);
        for (let char of chunk) {
          await new Promise((res) => setTimeout(res, 5));
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content += char;
            return updated;
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "⚠️ Something went wrong while streaming." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue("message", transcript, { shouldValidate: true });
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className="flex flex-col h-screen max-h-[80vh]">
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-4">
        {messages.length ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-xl p-3 max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : `${!isLoading && "bg-gray-200 dark:bg-gray-700"} text-black dark:text-white`
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div className="space-y-4">
              <div className="mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center">
                <Bot className="text-white w-8 h-8" />
              </div>
              <p>Ask anything related to the platform.</p>
            </div>
          </div>
        )}
        {isLoading && (
          <span className="loading loading-ring loading-md"></span>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-2 border-t border-black/10 dark:border-white/10">
        <div className="flex gap-2 items-center">
          <textarea
            className="input input-bordered bg-white pt-2 dark:bg-white/5 placeholder:text-black/30 dark:placeholder:text-white/70 flex-1 resize-none"
            placeholder="Ask your doubt related to platform..."
            {...register("message", { required: true })}
          />
          <button
            onClick={handleVoiceInput}
            className="btn btn-ghost dark:border border-white/10 dark:shadow-none dark:bg-white/5 py-1 px-1.5 border"
            title="Voice Input"
          >
            {isListening ? <MicOff  className="text-red-500" /> : <Mic className="text-green-500" />}
          </button>
          <button
            type="submit"
            className="btn btn-soft btn-primary dark:btn-ghost dark:border border-white/10 dark:text-white py-1 px-2.5"
            disabled={errors.message}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default FAQFAQChatAi;
