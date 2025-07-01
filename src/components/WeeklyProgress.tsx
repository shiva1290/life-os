
import React, { useState, useEffect } from 'react';

interface WeeklyData {
  week: string;
  goalsCompleted: number;
  habitsCompleted: number;
  tasksCompleted: number;
  studyHours: number;
  gymSessions: number;
}

const WeeklyProgress = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [currentWeekStats, setCurrentWeekStats] = useState({
    goalsCompleted: 0,
    habitsCompleted: 0,
    tasksCompleted: 0,
    studyHours: 0,
    gymSessions: 0,
  });

  // Load weekly data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weekly-progress');
    if (saved) {
      setWeeklyData(JSON.parse(saved));
    }
    
    // Calculate current week stats
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    // This would be calculated from actual data in a real implementation
    setCurrentWeekStats({
      goalsCompleted: Math.floor(Math.random() * 10) + 5,
      habitsCompleted: Math.floor(Math.random() * 35) + 20,
      tasksCompleted: Math.floor(Math.random() * 25) + 15,
      studyHours: Math.floor(Math.random() * 20) + 10,
      gymSessions: Math.floor(Math.random() * 6) + 3,
    });
  }, []);

  const getWeekOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const currentWeek = getWeekOfYear(new Date());
  const year = new Date().getFullYear();

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Weekly Progress</h2>
          <p className="text-sm text-muted-foreground">
            Week {currentWeek}, {year} • Track your consistency
          </p>
        </div>
        <div className="text-3xl animate-pulse-slow">📊</div>
      </div>

      {/* Current Week Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{currentWeekStats.goalsCompleted}</div>
          <div className="text-xs text-blue-300">Goals Hit</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{currentWeekStats.habitsCompleted}</div>
          <div className="text-xs text-green-300">Habits Done</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{currentWeekStats.tasksCompleted}</div>
          <div className="text-xs text-purple-300">Tasks Done</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">{currentWeekStats.studyHours}</div>
          <div className="text-xs text-orange-300">Study Hours</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{currentWeekStats.gymSessions}</div>
          <div className="text-xs text-red-300">Gym Sessions</div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="space-y-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-primary">🎯 This Week's Performance</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Goal Completion Rate:</span>
              <span className="text-green-400 font-medium">
                {Math.round((currentWeekStats.goalsCompleted / 15) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Habit Consistency:</span>
              <span className="text-blue-400 font-medium">
                {Math.round((currentWeekStats.habitsCompleted / 35) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Daily Task Average:</span>
              <span className="text-purple-400 font-medium">
                {Math.round(currentWeekStats.tasksCompleted / 7)} per day
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <h3 className="font-semibold mb-2 text-primary">💡 Weekly Insights</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• You're most productive on {['Monday', 'Tuesday', 'Wednesday'][Math.floor(Math.random() * 3)]}</li>
            <li>• {currentWeekStats.gymSessions >= 5 ? 'Excellent gym consistency!' : 'Try to hit 6 gym sessions this week'}</li>
            <li>• {currentWeekStats.studyHours >= 15 ? 'Great study rhythm' : 'Aim for 2+ hours of study daily'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;
