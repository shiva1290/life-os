
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (!isBreak) {
        setSessions(prev => prev + 1);
        // Start break
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        // Break finished
        setIsBreak(false);
        setTimeLeft(25 * 60); // Back to 25 minutes
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isBreak]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const startBreak = () => {
    setIsRunning(false);
    setIsBreak(true);
    setTimeLeft(5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Focus Timer</h2>
          <p className="text-sm text-muted-foreground">
            {isBreak ? 'Break Time' : 'Focus Time'} • {sessions} sessions completed
          </p>
        </div>
        <div className="text-3xl animate-pulse-slow">
          {isBreak ? '☕' : '🎯'}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold mb-4 ${isBreak ? 'text-orange-400' : 'text-primary'}`}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-secondary"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${isBreak ? 'text-orange-400' : 'text-primary'}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-2xl ${isBreak ? 'text-orange-400' : 'text-primary'}`}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="px-4 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={startBreak}
          className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Coffee size={20} />
          Break
        </button>
      </div>

      {/* Status */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isBreak 
            ? '☕ Take a well-deserved break!' 
            : '🧠 Deep focus mode - eliminate all distractions'
          }
        </p>
      </div>

      {/* Sessions Today */}
      {sessions > 0 && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-primary font-medium text-center">
            🎉 {sessions} Pomodoro session{sessions > 1 ? 's' : ''} completed today!
          </p>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
