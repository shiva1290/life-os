
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Settings, Plus, Minus } from 'lucide-react';

interface TimerSettings {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  sessionsUntilLongBreak: number;
}

const FocusTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  });
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('focus-timer-settings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings(parsedSettings);
      setTimeLeft(parsedSettings.focusTime * 60);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('focus-timer-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (!isBreak) {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        
        // Check if it's time for long break
        if (newSessions % settings.sessionsUntilLongBreak === 0) {
          setIsLongBreak(true);
          setIsBreak(true);
          setTimeLeft(settings.longBreak * 60);
        } else {
          setIsBreak(true);
          setTimeLeft(settings.shortBreak * 60);
        }
      } else {
        // Break finished
        setIsBreak(false);
        setIsLongBreak(false);
        setTimeLeft(settings.focusTime * 60);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isBreak, sessions, settings]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (isBreak) {
      setTimeLeft(isLongBreak ? settings.longBreak * 60 : settings.shortBreak * 60);
    } else {
      setTimeLeft(settings.focusTime * 60);
    }
  };

  const startBreak = (isLong = false) => {
    setIsRunning(false);
    setIsBreak(true);
    setIsLongBreak(isLong);
    setTimeLeft(isLong ? settings.longBreak * 60 : settings.shortBreak * 60);
  };

  const updateSetting = (key: keyof TimerSettings, value: number) => {
    if (value < 1) return;
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update current timer if not running and matches the changed setting
    if (!isRunning) {
      if (key === 'focusTime' && !isBreak) {
        setTimeLeft(value * 60);
      } else if (key === 'shortBreak' && isBreak && !isLongBreak) {
        setTimeLeft(value * 60);
      } else if (key === 'longBreak' && isBreak && isLongBreak) {
        setTimeLeft(value * 60);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDuration = () => {
    if (isBreak) {
      return isLongBreak ? settings.longBreak * 60 : settings.shortBreak * 60;
    }
    return settings.focusTime * 60;
  };

  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100;

  const getTimerType = () => {
    if (isLongBreak) return 'Long Break';
    if (isBreak) return 'Short Break';
    return 'Focus Time';
  };

  const getTimerColor = () => {
    if (isLongBreak) return 'text-purple-400';
    if (isBreak) return 'text-orange-400';
    return 'text-primary';
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Focus Timer</h2>
          <p className="text-sm text-muted-foreground">
            {getTimerType()} • {sessions} sessions completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings size={20} />
          </button>
          <div className="text-3xl animate-pulse-slow">
            {isLongBreak ? '🛌' : isBreak ? '☕' : '🎯'}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-secondary/50 rounded-lg space-y-4">
          <h3 className="font-semibold text-foreground">Timer Settings</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Focus Time (min)</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateSetting('focusTime', settings.focusTime - 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center">{settings.focusTime}</span>
                <button
                  onClick={() => updateSetting('focusTime', settings.focusTime + 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Short Break (min)</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateSetting('shortBreak', settings.shortBreak - 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center">{settings.shortBreak}</span>
                <button
                  onClick={() => updateSetting('shortBreak', settings.shortBreak + 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Long Break (min)</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateSetting('longBreak', settings.longBreak - 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center">{settings.longBreak}</span>
                <button
                  onClick={() => updateSetting('longBreak', settings.longBreak + 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Sessions until Long Break</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateSetting('sessionsUntilLongBreak', settings.sessionsUntilLongBreak - 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center">{settings.sessionsUntilLongBreak}</span>
                <button
                  onClick={() => updateSetting('sessionsUntilLongBreak', settings.sessionsUntilLongBreak + 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold mb-4 ${getTimerColor()}`}>
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
              className={`transition-all duration-1000 ${getTimerColor()}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-2xl ${getTimerColor()}`}>
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
          onClick={() => startBreak(false)}
          className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Coffee size={20} />
          Short
        </button>
        
        <button
          onClick={() => startBreak(true)}
          className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Coffee size={20} />
          Long
        </button>
      </div>

      {/* Status */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isLongBreak 
            ? '🛌 Take a long, well-deserved break!' 
            : isBreak 
            ? '☕ Quick break - stretch and hydrate!' 
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
