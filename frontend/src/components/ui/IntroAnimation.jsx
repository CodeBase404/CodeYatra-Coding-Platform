import React, { useState, useEffect } from "react";
import { Code, Terminal, Zap, Play } from "lucide-react";

const IntroAnimation = ({ onEnd }) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  const codeSnippets = [
    "function solve(arr) {",
    "  return arr.sort((a, b) => a - b);",
    "}",
    "",
    "const result = solve([3, 1, 4, 1, 5]);",
  ];

  const floatingSymbols = ["{ }", "[ ]", "( )", "<>", "++", "--", "=>", "&&"];

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationPhase(1), 300),
      setTimeout(() => setAnimationPhase(2), 1200),
      setTimeout(() => setAnimationPhase(3), 2000),
      setTimeout(() => setAnimationPhase(4), 3200),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

   useEffect(() => {
    const timer = setTimeout(() => {
      onEnd();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {floatingSymbols.map((symbol, index) => (
        <div
          key={symbol}
          className={`absolute text-green-400/30 font-mono text-lg transition-all duration-1000 ${
            animationPhase >= 1 ? "opacity-100 animate-bounce" : "opacity-0"
          }`}
          style={{
            left: `${15 + ((index * 10) % 70)}%`,
            top: `${20 + ((index * 15) % 60)}%`,
            animationDelay: `${index * 0.2}s`,
            animationDuration: "3s",
          }}
        >
          {symbol}
        </div>
      ))}

      <div className="relative z-10 text-center space-y-8">
        <div
          className={`bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 p-1 transition-all duration-1000 ${
            animationPhase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="bg-gray-700/50 rounded-t-md px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Terminal size={14} />
              <span>challenge.js</span>
            </div>
          </div>

          <div className="p-6 font-mono text-left">
            {codeSnippets.map((line, index) => (
              <div
                key={index}
                className={`text-green-400 transition-all duration-500 ${
                  animationPhase >= 2 ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${index * 0.3}s`,
                }}
              >
                <span className="text-gray-500 select-none mr-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <TypewriterText
                  text={line}
                  delay={index * 300 + 1200}
                  speed={50}
                />
              </div>
            ))}

            <div
              className={`inline-block w-2 h-5 bg-green-400 ml-1 ${
                animationPhase >= 2 ? "animate-pulse" : "opacity-0"
              }`}
            />
          </div>
        </div>

        <div
          className={`space-y-4 transition-all duration-1000 ${
            animationPhase >= 3
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Code className="text-green-400 animate-pulse" size={32} />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Welcome to CodeYatra
            </h1>
            <Zap className="text-yellow-400 animate-pulse" size={32} />
          </div>

          <p className="text-gray-300 text-lg md:text-xl font-light">
            Your Journey to Competitive Coding Excellence
          </p>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl" />
    </div>
  );
};

const TypewriterText = ({ text, delay, speed }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span>
      {displayText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default IntroAnimation;
