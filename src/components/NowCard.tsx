
import React, { useState, useEffect } from 'react';
import { Calendar, Target, Sparkles } from 'lucide-react';

const NowCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentBlock, setCurrentBlock] = useState<any>(null);
  const [reflection, setReflection] = useState('');

  // Get current schedule from localStorage
  const getCurrentSchedule = () => {
    const today = new Date().getDay();
    let scheduleKey = 'weekday';
    
    if (today === 6) scheduleKey = 'saturday';
    if (today === 0) scheduleKey = 'sunday';
    
    const schedule = JSON.parse(localStorage.getItem(`schedule-${scheduleKey}`) || '[]');
    return schedule;
  };

  const getCurrentTimeBlock = () => {
    const schedule = getCurrentSchedule();
    if (!schedule.length) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    for (let i = 0; i < schedule.length; i++) {
      const [hour, minute] = schedule[i].time.split(':').map(Number);
      const blockTime = hour * 60 + minute;
      
      if (i === schedule.length - 1 || currentTime < blockTime) {
        return schedule[i];
      }
      
      if (i < schedule.length - 1) {
        const [nextHour, nextMinute] = schedule[i + 1].time.split(':').map(Number);
        const nextBlockTime = nextHour * 60 + nextMinute;
        
        if (currentTime >= blockTime && currentTime < nextBlockTime) {
          return schedule[i];
        }
      }
    }
    
    return schedule[0];
  };

  useEffect(() => {
    const updateCurrent = () => {
      setCurrentTime(new Date());
      setCurrentBlock(getCurrentTimeBlock());
    };

    updateCurrent();
    const interval = setInterval(updateCurrent, 60000);

    // Load daily reflection
    const savedReflection = localStorage.getItem(`reflection-${new Date().toDateString()}`);
    if (savedReflection) setReflection(savedReflection);

    return () => clearInterval(interval);
  }, []);

  const saveReflection = () => {
    localStorage.setItem(`reflection-${new Date().toDateString()}`, reflection);
  };

  if (!currentBlock) return null;

  return (
    <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl">
      {/* Liquid Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 animate-pulse-slow" />
      
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white/90">Right Now</h2>
          </div>
          <div className="text-sm text-white/70 font-mono bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-6 mb-6">
          <div className="text-6xl animate-pulse-slow drop-shadow-lg">
            {currentBlock.emoji}
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {currentBlock.task}
            </h3>
            <p className="text-white/70 text-lg">
              Scheduled for {currentBlock.time}
            </p>
            <div className="mt-2 px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 w-fit backdrop-blur-sm">
              {currentBlock.type.charAt(0).toUpperCase() + currentBlock.type.slice(1)}
            </div>
          </div>
        </div>
        
        {/* Active Block Highlight */}
        <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-500/30 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            <span className="text-sm text-green-300 font-medium">ACTIVE NOW</span>
          </div>
          <p className="text-sm text-white/80">
            💡 Stay focused on this single task. You're exactly where you need to be.
          </p>
        </div>

        {/* Daily Reflection */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-orange-400" />
            <h4 className="font-semibold text-white">Daily Reflection</h4>
          </div>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            onBlur={saveReflection}
            placeholder="What did I win today? What am I grateful for?"
            className="w-full p-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm resize-none"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default NowCard;
