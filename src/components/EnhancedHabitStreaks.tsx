import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, TrendingUp, Flame, Target, Eye, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';

interface DayData {
  date: string;
  habits_completed: number;
  total_habits: number;
  habit_completion_rate: number;
  intensity: number; // 0-4 scale based on habit completion
}

interface HabitStreak {
  current: number;
  longest: number;
  lastCompletionDate?: string;
}

interface DetailedStats {
  totalDays: number;
  activeDays: number;
  perfectDays: number;
  streaks: HabitStreak;
  weeklyAverage: number;
  monthlyTrend: 'up' | 'down' | 'stable';
  avgCompletionRate: number;
}

type ViewMode = '30' | '90' | '365';

const EnhancedHabitStreaks = () => {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const [data, setData] = useState<DayData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('365');
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DetailedStats | null>(null);

  useEffect(() => {
    if (isGuestMode) {
      setGuestStreakData();
    } else if (user) {
      fetchStreakData();
    }
  }, [user, isGuestMode, viewMode, guestData]);

  const setGuestStreakData = () => {
    setLoading(true);
    
    const days = parseInt(viewMode);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    
    const totalHabits = guestData.habits.length;
    const dayData: DayData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Simulate habit completion data for guest mode
      // Create realistic but static data that shows progress
      let habitsCompleted = 0;
      const dayOffset = i % 7; // Create weekly patterns
      
      if (dayOffset === 0 || dayOffset === 6) { // Weekends
        habitsCompleted = Math.floor(totalHabits * 0.4); // 40% completion on weekends
      } else if (i < days - 3) { // Recent days have higher completion
        habitsCompleted = Math.floor(totalHabits * (0.6 + (i / days) * 0.3)); // 60-90% completion
      } else { // Last few days
        habitsCompleted = Math.floor(totalHabits * 0.8); // 80% completion
      }
      
      const completionRate = totalHabits > 0 ? habitsCompleted / totalHabits : 0;
      
      let intensity = 0;
      if (completionRate >= 1) intensity = 4;
      else if (completionRate >= 0.8) intensity = 3;
      else if (completionRate >= 0.6) intensity = 2;
      else if (completionRate >= 0.3) intensity = 1;
      else intensity = 0;
      
      dayData.push({
        date: dateStr,
        habits_completed: habitsCompleted,
        total_habits: totalHabits,
        habit_completion_rate: completionRate,
        intensity
      });
    }
    
    setData(dayData);
    setStats(calculateStats(dayData));
    setLoading(false);
  };

  const fetchStreakData = async () => {
    if (!user || isGuestMode) return;
    setLoading(true);

    try {
      const days = parseInt(viewMode);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      const endDate = new Date();

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Fetch habits and habit completions - focusing on actual tracked habits
      const [habitsResult, habitCompletionsResult] = await Promise.all([
        // Get all user habits
        supabase
          .from('habits')
          .select('id, name, category, color, icon')
          .eq('user_id', user.id),
        
        // Get habit completions for date range
        supabase
          .from('habit_completions')
          .select('completed_date, habit_id')
          .eq('user_id', user.id)
          .gte('completed_date', startDateStr)
          .lte('completed_date', endDateStr)
      ]);

      const habits = habitsResult.data || [];
      const habitCompletions = habitCompletionsResult.data || [];
      const totalHabits = habits.length;

      // Group habit completions by date
      const completionsByDate = habitCompletions.reduce((acc, completion) => {
        const date = completion.completed_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(completion);
        return acc;
      }, {} as Record<string, any[]>);

      // Generate day data focusing on habits
      const dayData: DayData[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const habitsCompleted = completionsByDate[dateStr]?.length || 0;
        const completionRate = totalHabits > 0 ? habitsCompleted / totalHabits : 0;

        // Calculate intensity based on habit completion rate
        let intensity = 0;
        if (completionRate >= 1) intensity = 4;      // Perfect day - all habits
        else if (completionRate >= 0.8) intensity = 3; // Great day - 80%+
        else if (completionRate >= 0.6) intensity = 2; // Good day - 60%+
        else if (completionRate >= 0.3) intensity = 1; // Some progress - 30%+
        else intensity = 0; // No habits completed

        dayData.push({
          date: dateStr,
          habits_completed: habitsCompleted,
          total_habits: totalHabits,
          habit_completion_rate: completionRate,
          intensity
        });
      }

      setData(dayData);
      setStats(calculateStats(dayData));
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (dayData: DayData[]): DetailedStats => {
    const activeDays = dayData.filter(d => d.habits_completed > 0).length;
    const perfectDays = dayData.filter(d => d.habit_completion_rate >= 1).length;

    // Calculate current streak (days with at least 1 habit completed)
    let currentStreak = 0;
    for (let i = dayData.length - 1; i >= 0; i--) {
      if (dayData[i].habits_completed > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (const day of dayData) {
      if (day.habits_completed > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate weekly average and completion rate
    const weeks = Math.ceil(dayData.length / 7);
    const weeklyAverage = activeDays / weeks;
    const avgCompletionRate = dayData.reduce((sum, day) => sum + day.habit_completion_rate, 0) / dayData.length;

    // Calculate monthly trend
    const midPoint = Math.floor(dayData.length / 2);
    const firstHalf = dayData.slice(0, midPoint);
    const secondHalf = dayData.slice(midPoint);
    const firstHalfRate = firstHalf.reduce((sum, day) => sum + day.habit_completion_rate, 0) / firstHalf.length;
    const secondHalfRate = secondHalf.reduce((sum, day) => sum + day.habit_completion_rate, 0) / secondHalf.length;
    
    let monthlyTrend: 'up' | 'down' | 'stable' = 'stable';
    if (secondHalfRate > firstHalfRate + 0.1) monthlyTrend = 'up';
    else if (firstHalfRate > secondHalfRate + 0.1) monthlyTrend = 'down';

    return {
      totalDays: dayData.length,
      activeDays,
      perfectDays,
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      weeklyAverage,
      monthlyTrend,
      avgCompletionRate
    };
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-slate-800/50 border-slate-700/50';
    
    const colors = [
      'bg-purple-900/80 border-purple-800/50',  // 1 - Some progress
      'bg-purple-700/80 border-purple-600/50',  // 2 - Good day
      'bg-purple-500/80 border-purple-400/50',  // 3 - Great day
      'bg-purple-300/90 border-purple-200/50'   // 4 - Perfect day
    ];

    return colors[Math.min(intensity - 1, colors.length - 1)];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getGridLayout = () => {
    switch (viewMode) {
      case '30':
        // 30 days: 6 columns × 5 rows
        return { 
          cols: 'grid-cols-6', 
          colCount: 6,
          squareSize: 'w-3 h-3',
          gap: 'gap-1'
        };
      case '90':
        // 90 days: 18 columns × 5 rows  
        return { 
          cols: 'grid-cols-[repeat(18,minmax(0,1fr))]', 
          colCount: 18,
          squareSize: 'w-2.5 h-2.5',
          gap: 'gap-0.5'
        };
      case '365':
        // 365 days: 53 weeks × 7 days (GitHub style)
        return { 
          cols: 'grid-cols-[repeat(53,minmax(0,1fr))]', 
          colCount: 53,
          squareSize: 'w-2 h-2',
          gap: 'gap-0.5'
        };
      default:
        return { 
          cols: 'grid-cols-6', 
          colCount: 6,
          squareSize: 'w-3 h-3',
          gap: 'gap-1'
        };
    }
  };

  const formatGridData = () => {
    if (viewMode === '365') {
      // For 365 view, organize data in weeks (7 days per week, 53 weeks)
      const weeks: DayData[][] = [];
      for (let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7));
      }
      // Flatten back but ensure we have exactly 371 items (53 weeks × 7 days)
      const flatData = weeks.flat();
      while (flatData.length < 371) {
        flatData.push({
          date: '',
          habits_completed: 0,
          total_habits: 0,
          habit_completion_rate: 0,
          intensity: 0
        });
      }
      return flatData.slice(0, 371);
    }
    
    return data;
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const gridLayout = getGridLayout();
  const gridData = formatGridData();

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">🔥 Habit Streak Heatmap</h3>
              <p className="text-sm text-white/70">Your habit completion journey</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchStreakData}
            className="text-white/70 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex bg-white/5 rounded-2xl p-1">
            {(['30', '90', '365'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs rounded-xl transition-all ${
                  viewMode === mode
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {mode}d
              </button>
            ))}
          </div>
          
          <div className="text-xs text-white/60">
            Tracking {data[0]?.total_habits || 0} habits
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mb-6 flex flex-col items-center">
          <div className={`${viewMode === '365' ? 'overflow-x-auto w-full pb-2' : ''}`}>
            <div className={`grid ${gridLayout.cols} ${gridLayout.gap} mb-4 ${viewMode === '365' ? 'min-w-max mx-auto' : 'max-w-fit mx-auto'}`}
                 style={viewMode === '365' ? { gridTemplateRows: 'repeat(7, minmax(0, 1fr))' } : {}}>
              {gridData.map((day, index) => (
                <div
                  key={index}
                  className={`${gridLayout.squareSize} rounded-sm border ${getIntensityColor(day.intensity)} 
                    transition-all hover:scale-110 cursor-pointer hover:border-white/50`}
                  onClick={() => day.date && setSelectedDay(day)}
                  title={day.date ? `${formatDate(day.date)}: ${day.habits_completed}/${day.total_habits} habits (${Math.round(day.habit_completion_rate * 100)}%)` : ''}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-white/60">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-800/50 border border-slate-700/50" />
              <div className={`w-2.5 h-2.5 rounded-sm ${getIntensityColor(1)}`} />
              <div className={`w-2.5 h-2.5 rounded-sm ${getIntensityColor(2)}`} />
              <div className={`w-2.5 h-2.5 rounded-sm ${getIntensityColor(3)}`} />
              <div className={`w-2.5 h-2.5 rounded-sm ${getIntensityColor(4)}`} />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-purple-400" />
              <div className="text-xl font-bold text-purple-400">{stats.streaks.current}</div>
              <div className="text-xs text-white/60">Current Streak</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <Target className="w-5 h-5 mx-auto mb-2 text-pink-400" />
              <div className="text-xl font-bold text-pink-400">{stats.streaks.longest}</div>
              <div className="text-xs text-white/60">Best Streak</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-400" />
              <div className="text-xl font-bold text-blue-400">{stats.perfectDays}</div>
              <div className="text-xs text-white/60">Perfect Days</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-xl font-bold text-green-400">
                {Math.round(stats.avgCompletionRate * 100)}%
              </div>
              <div className="text-xs text-white/60">Avg Completion</div>
            </div>
          </div>
        )}

        {/* Selected Day Details */}
        {selectedDay && (
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">{formatDate(selectedDay.date)}</h4>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/70">Habits Completed</div>
                <div className="text-white font-semibold">
                  {selectedDay.habits_completed}/{selectedDay.total_habits}
                </div>
              </div>
              <div>
                <div className="text-white/70">Completion Rate</div>
                <div className="text-white font-semibold">
                  {Math.round(selectedDay.habit_completion_rate * 100)}%
                </div>
              </div>
            </div>
            
            {selectedDay.habit_completion_rate >= 1 && (
              <div className="mt-3 p-2 bg-purple-500/20 rounded-lg text-center">
                <span className="text-purple-300 text-sm">🎉 Perfect Day! All habits completed!</span>
              </div>
            )}
            
            {selectedDay.habits_completed === 0 && (
              <div className="mt-3 p-2 bg-slate-500/20 rounded-lg text-center">
                <span className="text-slate-300 text-sm">No habits completed this day</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedHabitStreaks; 