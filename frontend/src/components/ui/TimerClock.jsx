import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Timer,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";

function TimerClock({
  show,
  mode,
  setMode,
  isRunning,
  setIsRunning,
  time,
  setTime,
  timerDuration,
  setTimerDuration,
  setShow
}) {
  const [inputMode, setInputMode] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (mode === "stopwatch") {
            return prev + 1;
          } else {
            if (prev <= 1) {
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartStop = () => {
    if (mode === "timer" && time === 0) {
      const totalSeconds =
        timerDuration.hours * 3600 +
        timerDuration.minutes * 60 +
        timerDuration.seconds;
      setTime(totalSeconds);
    }
    setIsRunning((prev) => !prev);
    setInputMode(false);
    setShow(false)
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInputMode(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTime(0);
    setInputMode(false);
  };

  const updateTimerDuration = (unit, increment) => {
    setTimerDuration((prev) => {
      const newDuration = { ...prev };
      if (increment) {
        if (unit === "hours" && newDuration.hours < 23) newDuration.hours++;
        if (unit === "minutes" && newDuration.minutes < 59)
          newDuration.minutes++;
        if (unit === "seconds" && newDuration.seconds < 59)
          newDuration.seconds++;
      } else {
        if (unit === "hours" && newDuration.hours > 0) newDuration.hours--;
        if (unit === "minutes" && newDuration.minutes > 0)
          newDuration.minutes--;
        if (unit === "seconds" && newDuration.seconds > 0)
          newDuration.seconds--;
      }
      return newDuration;
    });
  };

  const getDisplayTime = () => {
    if (mode === "timer" && time === 0 && !isRunning) {
      const totalSeconds =
        timerDuration.hours * 3600 +
        timerDuration.minutes * 60 +
        timerDuration.seconds;
      return formatTime(totalSeconds);
    }
    return formatTime(time);
  };

  const getProgress = () => {
    if (mode === "timer") {
      const totalSeconds =
        timerDuration.hours * 3600 +
        timerDuration.minutes * 60 +
        timerDuration.seconds;
      return totalSeconds > 0
        ? ((totalSeconds - time) / totalSeconds) * 100
        : 0;
    }
    return 0;
  };

  return (
    <div className=" w-full flex items-center justify-center p-4">
      {show && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Mode Selection */}
          <div className="flex w-full justify-between gap-3">
            <button
              onClick={() => handleModeChange("stopwatch")}
              className={`w-full h-20 border border-white/20 flex flex-col items-center justify-center gap-2 rounded-xl text-xs transition-all duration-300 ${
                mode === "stopwatch"
                  ? "bg-blue-500/30 border-blue-400/50 text-blue-100"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Timer size={26} />
              <div className="font-medium">Stopwatch</div>
            </button>
            <button
              onClick={() => handleModeChange("timer")}
              className={`w-full h-20 border border-white/20 flex flex-col items-center justify-center gap-2 rounded-xl text-xs transition-all duration-300 ${
                mode === "timer"
                  ? "bg-purple-500/30 border-purple-400/50 text-purple-100"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Clock size={26} />
              <div className="font-medium">Timer</div>
            </button>
          </div>

          {/* Time Display */}
          <div className="relative">
            <div onClick={() => setInputMode(!inputMode)}  className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-6xl font-light text-white font-mono tracking-wider">
                {getDisplayTime()}
              </div>

              {mode === "timer" && !isRunning && time === 0 && (
                <button 
                  className="text-sm text-white/60 pt-2 hover:text-white transition-colors"
                >
                  Click to set duration
                </button>
              )}
            </div>

            {/* Timer Duration Input */}
            {mode === "timer" && inputMode && !isRunning && (
              <div className="mt-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex justify-center space-x-6">
                  {/* Hours */}
                  <div className="text-center">
                    <button
                      onClick={() => updateTimerDuration("hours", true)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors mb-2"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="text-2xl font-mono text-white">
                      {timerDuration.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-white/60 mb-2">hours</div>
                    <button
                      onClick={() => updateTimerDuration("hours", false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  </div>

                  {/* Minutes */}
                  <div className="text-center">
                    <button
                      onClick={() => updateTimerDuration("minutes", true)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors mb-2"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="text-2xl font-mono text-white">
                      {timerDuration.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-white/60 mb-2">minutes</div>
                    <button
                      onClick={() => updateTimerDuration("minutes", false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  </div>

                  {/* Seconds */}
                  <div className="text-center">
                    <button
                      onClick={() => updateTimerDuration("seconds", true)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors mb-2"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="text-2xl font-mono text-white">
                      {timerDuration.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-white/60 mb-2">seconds</div>
                    <button
                      onClick={() => updateTimerDuration("seconds", false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="space-y-3">
            {!isRunning ? (
              <button
                onClick={handleStartStop}
                className="border w-full rounded-xl p-3 flex items-center justify-center gap-3 text-sm font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-100 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 shadow-lg"
              >
                <Play size={18} />
                <div>Start {mode === "stopwatch" ? "Watch" : "Timer"}</div>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="w-full border rounded-xl p-3 flex items-center justify-center gap-2 text-sm bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                <RotateCcw size={16} />
                <div>Reset</div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerClock;
