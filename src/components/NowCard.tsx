
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Coffee, Sparkles } from 'lucide-react';

const NowCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentActivity = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 6 && hour < 9) return { activity: 'Morning Routine', emoji: '🌅', color: 'from-orange-400 to-yellow-400' };
    if (hour >= 9 && hour < 12) return { activity: 'Deep Work', emoji: '💻', color: 'from-blue-400 to-purple-400' };
    if (hour >= 12 && hour < 14) return { activity: 'Lunch Break', emoji: '🍽️', color: 'from-green-400 to-teal-400' };
    if (hour >= 14 && hour < 17) return { activity: 'Afternoon Focus', emoji: '🎯', color: 'from-purple-400 to-pink-400' };
    if (hour >= 17 && hour < 19) return { activity: 'Gym Time', emoji: '🏋️', color: 'from-red-400 to-orange-400' };
    if (hour >= 19 && hour < 22) return { activity: 'Evening Wind Down', emoji: '📚', color: 'from-indigo-400 to-blue-400' };
    return { activity: 'Rest Time', emoji: '😴', color: 'from-gray-400 to-slate-400' };
  };

  const currentActivity = getCurrentActivity();
  const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-6">
        {/* Time Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-white/70" />
            <span className="text-white/70 text-sm font-medium">NOW</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <Calendar size={14} />
            {currentTime.toLocaleDateString([], { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Current Activity */}
        <div className="relative mb-6">
          <div className={`bg-gradient-to-r ${currentActivity.color} rounded-2xl p-4 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="text-2xl mb-2">{currentActivity.emoji}</div>
              <div className="text-white font-semibold">{currentActivity.activity}</div>
            </div>
          </div>
        </div>

        {/* Reflection Section */}
        <div className="space-y-3">
          <button
            onClick={() => setShowReflection(!showReflection)}
            className="w-full flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">Daily Reflection</span>
            </div>
            <div className="text-white/60">
              {showReflection ? '▼' : '▶'}
            </div>
          </button>

          {showReflection && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                placeholder="What did I win today?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-sm text-sm"
              />
              {reflection && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Coffee size={14} />
                    Great reflection! Keep up the momentum.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Weekend Badge */}
        {isWeekend && (
          <div className="mt-4 p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <div className="text-center text-white/80 text-sm font-medium">
              🎉 Weekend Vibes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NowCard;
