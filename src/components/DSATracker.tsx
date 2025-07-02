
import React, { useState, useEffect } from 'react';
import { Code, TrendingUp } from 'lucide-react';

const DSATracker = () => {
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const dsaData = JSON.parse(localStorage.getItem('dsa-tracker') || '{}');
    
    setTodayCount(dsaData[today] || 0);
    
    // Calculate weekly count
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    let weekly = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      weekly += dsaData[date.toDateString()] || 0;
    }
    
    setWeeklyCount(weekly);
    
    // Calculate streak
    let currentStreak = 0;
    const currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toDateString();
      if (dsaData[dateStr] && dsaData[dateStr] > 0) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  }, []);

  const addProblem = () => {
    const today = new Date().toDateString();
    const dsaData = JSON.parse(localStorage.getItem('dsa-tracker') || '{}');
    dsaData[today] = (dsaData[today] || 0) + 1;
    localStorage.setItem('dsa-tracker', JSON.stringify(dsaData));
    setTodayCount(dsaData[today]);
    
    // Recalculate weekly
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    let weekly = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      weekly += dsaData[date.toDateString()] || 0;
    }
    
    setWeeklyCount(weekly);
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <Code className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">DSA Progress</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-400">{todayCount}</div>
          <div className="text-xs text-white/70">Today</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-400">{weeklyCount}</div>
          <div className="text-xs text-white/70">This Week</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-2xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-white/70">Day Streak</div>
        </div>
      </div>
      
      <button
        onClick={addProblem}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
      >
        + Solved a Problem
      </button>
    </div>
  );
};

export default DSATracker;
