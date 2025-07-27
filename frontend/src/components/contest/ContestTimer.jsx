import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';


export const ContestTimer = ({ endTime, startTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const start = new Date(startTime).getTime();
      const totalDuration = end - start;
      const elapsed = now - start;
      const remaining = end - now;

      if (remaining <= 0) {
        setTimeLeft('Contest Ended');
        setIsActive(false);
        setProgress(100);
        return;
      }

      if (now < start) {
        setTimeLeft('Not Started');
        setIsActive(false);
        setProgress(0);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setProgress((elapsed / totalDuration) * 100);
      setIsActive(true);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, startTime]);

  const getTimerColor = () => {
    if (!isActive) return 'text-gray-400';
    if (progress > 80) return 'text-red-400';
    if (progress > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBorderColor = () => {
    if (!isActive) return 'border-gray-500';
    if (progress > 80) return 'border-red-500';
    if (progress > 60) return 'border-yellow-500';
    return 'border-green-500';
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className={`w-24 h-24 rounded-full border-4 ${getBorderColor()} flex items-center justify-center bg-gray-800/50 backdrop-blur`}>
          <div className={`${getTimerColor()} font-mono text-sm font-bold text-center`}>
            <div className="text-xs opacity-75">Time Left</div>
            <div>{timeLeft}</div>
          </div>
        </div>
        {isActive && (
          <div 
            className={`absolute inset-0 rounded-full border-4 ${getBorderColor()}/20 animate-pulse`}
            style={{
              background: `conic-gradient(from 0deg, ${progress > 80 ? '#ef4444' : progress > 60 ? '#eab308' : '#22c55e'} ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
            }}
          ></div>
        )}
      </div>
      
      <div className="text-gray-300">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          <span>Contest Progress: {Math.round(progress)}%</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <Calendar className="w-3 h-3" />
          <span>Started: {new Date(startTime).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};