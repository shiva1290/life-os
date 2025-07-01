
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

  // Get current week info
  const getWeekInfo = () => {
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekKey = `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
    
    return { weekKey, weekStart, weekEnd };
  };

  // Calculate real stats from localStorage data
  const calculateRealStats = () => {
    const { weekKey, weekStart, weekEnd } = getWeekInfo();
    
    // Get goals data
    const goalsData = localStorage.getItem('lifeOS-goals');
    let goalsCompleted = 0;
    if (goalsData) {
      const goals = JSON.parse(goalsData);
      goals.forEach((category: any) => {
        goalsCompleted += category.goals.filter((goal: any) => goal.completed).length;
      });
    }
    
    // Get habits data for this week
    const habitsData = localStorage.getItem('habits-editable');
    const habitHistory = localStorage.getItem('habit-history');
    let habitsCompleted = 0;
    
    if (habitsData && habitHistory) {
      const habits = JSON.parse(habitsData);
      const history = JSON.parse(habitHistory);
      
      // Count completed habits for current week
      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        habits.forEach((habit: any) => {
          const habitDays = history[habit.id] || [];
          const dayRecord = habitDays.find((day: any) => day.date === dateStr);
          if (dayRecord?.completed) {
            habitsCompleted++;
          }
        });
      }
    }
    
    // Get todos data for this week
    const todosData = localStorage.getItem('daily-todos');
    let tasksCompleted = 0;
    if (todosData) {
      const todos = JSON.parse(todosData);
      tasksCompleted = todos.filter((todo: any) => todo.completed).length;
    }
    
    // Get focus timer data (study hours)
    const timerData = localStorage.getItem('focus-sessions');
    let studyHours = 0;
    if (timerData) {
      const sessions = JSON.parse(timerData);
      const thisWeekSessions = sessions.filter((session: any) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      studyHours = Math.round(thisWeekSessions.reduce((total: number, session: any) => total + (session.duration / 60), 0));
    }
    
    // Count gym sessions (from habit data)
    let gymSessions = 0;
    if (habitsData && habitHistory) {
      const habits = JSON.parse(habitsData);
      const history = JSON.parse(habitHistory);
      const gymHabit = habits.find((h: any) => h.name.toLowerCase().includes('gym') || h.name.toLowerCase().includes('workout'));
      
      if (gymHabit) {
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const habitDays = history[gymHabit.id] || [];
          const dayRecord = habitDays.find((day: any) => day.date === dateStr);
          if (dayRecord?.completed) {
            gymSessions++;
          }
        }
      }
    }
    
    return {
      goalsCompleted,
      habitsCompleted,
      tasksCompleted,
      studyHours,
      gymSessions,
    };
  };

  // Load and calculate stats
  useEffect(() => {
    const saved = localStorage.getItem('weekly-progress');
    if (saved) {
      setWeeklyData(JSON.parse(saved));
    }
    
    // Calculate real current week stats
    const realStats = calculateRealStats();
    setCurrentWeekStats(realStats);
    
    // Save current week to history if it's Sunday
    const today = new Date();
    if (today.getDay() === 0) { // Sunday
      const { weekKey } = getWeekInfo();
      const existingWeek = weeklyData.find(w => w.week === weekKey);
      
      if (!existingWeek) {
        const newWeekData = {
          week: weekKey,
          ...realStats
        };
        const updatedWeeklyData = [...weeklyData, newWeekData];
        setWeeklyData(updatedWeeklyData);
        localStorage.setItem('weekly-progress', JSON.stringify(updatedWeeklyData));
      }
    }
  }, []);

  // Update stats every hour
  useEffect(() => {
    const interval = setInterval(() => {
      const realStats = calculateRealStats();
      setCurrentWeekStats(realStats);
    }, 60000 * 60); // Every hour

    return () => clearInterval(interval);
  }, []);

  const getWeekOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const currentWeek = getWeekOfYear(new Date());
  const year = new Date().getFullYear();

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold gradient-text">Weekly Progress</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Week {currentWeek}, {year} • Real progress tracking
          </p>
        </div>
        <div className="text-2xl sm:text-3xl animate-pulse-slow">📊</div>
      </div>

      {/* Current Week Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-blue-400">{currentWeekStats.goalsCompleted}</div>
          <div className="text-xs text-blue-300">Goals Hit</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-green-400">{currentWeekStats.habitsCompleted}</div>
          <div className="text-xs text-green-300">Habits Done</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-purple-400">{currentWeekStats.tasksCompleted}</div>
          <div className="text-xs text-purple-300">Tasks Done</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-orange-400">{currentWeekStats.studyHours}</div>
          <div className="text-xs text-orange-300">Study Hours</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-red-400">{currentWeekStats.gymSessions}</div>
          <div className="text-xs text-red-300">Gym Sessions</div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="space-y-4">
        <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
          <h3 className="font-semibold mb-2 text-primary text-sm sm:text-base">🎯 This Week's Performance</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span>Goal Completion:</span>
              <span className="text-green-400 font-medium">
                {currentWeekStats.goalsCompleted} goals
              </span>
            </div>
            <div className="flex justify-between">
              <span>Daily Habit Average:</span>
              <span className="text-blue-400 font-medium">
                {Math.round(currentWeekStats.habitsCompleted / 7)} per day
              </span>
            </div>
            <div className="flex justify-between">
              <span>Study Consistency:</span>
              <span className="text-orange-400 font-medium">
                {currentWeekStats.studyHours} hours total
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-3 sm:p-4 border border-primary/20">
          <h3 className="font-semibold mb-2 text-primary text-sm sm:text-base">💡 Weekly Insights</h3>
          <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
            <li>• {currentWeekStats.gymSessions >= 5 ? 'Excellent gym consistency! 🔥' : `Need ${6 - currentWeekStats.gymSessions} more gym sessions`}</li>
            <li>• {currentWeekStats.studyHours >= 14 ? 'Great study rhythm 📚' : 'Aim for 2+ hours of study daily'}</li>
            <li>• {currentWeekStats.habitsCompleted >= 35 ? 'Habit master! 🏆' : 'Focus on daily habit consistency'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;
