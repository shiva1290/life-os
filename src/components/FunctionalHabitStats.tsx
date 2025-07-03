import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { supabase } from '@/integrations/supabase/client';

interface HabitStats {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  weeklyCompletion: number;
  bestStreak: number;
  perfectDays: number;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  current_streak: number;
  best_streak: number;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
}

const FunctionalHabitStats = () => {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    weeklyCompletion: 0,
    bestStreak: 0,
    perfectDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuestMode) {
      setGuestStats();
    } else if (user) {
      fetchHabitStats();
    }
  }, [user, isGuestMode, guestData]);

  const setGuestStats = () => {
    const totalHabits = guestData.habits.length;
    const completedToday = Math.floor(totalHabits * 0.8); // 80% completion rate for demo
    
    setStats({
      totalHabits,
      completedToday,
      currentStreak: 7, // Show a 7-day streak for demo
      weeklyCompletion: 75, // 75% weekly completion
      bestStreak: 15, // Best streak of 15 days
      perfectDays: 3 // 3 perfect days in the last month
    });
    setLoading(false);
  };

  const fetchHabitStats = async () => {
    if (!user || isGuestMode) return;

    try {
      // Fetch all habits
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) throw habitsError;

      // Fetch today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: todayCompletions, error: todayError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed_date', today);

      if (todayError) throw todayError;

      // Fetch this week's completions
      const weekStart = getWeekStart(new Date());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const { data: weekCompletions, error: weekError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_date', weekStart.toISOString().split('T')[0])
        .lt('completed_date', weekEnd.toISOString().split('T')[0]);

      if (weekError) throw weekError;

      // Fetch last 30 days for streak calculation
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentCompletions, error: recentError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_date', thirtyDaysAgo.toISOString().split('T')[0]);

      if (recentError) throw recentError;

      // Calculate statistics
      const totalHabits = habits?.length || 0;
      const completedToday = todayCompletions?.length || 0;
      
      // Calculate weekly completion rate
      const daysInWeek = 7;
      const possibleCompletions = totalHabits * daysInWeek;
      const actualCompletions = weekCompletions?.length || 0;
      const weeklyCompletion = possibleCompletions > 0 ? Math.round((actualCompletions / possibleCompletions) * 100) : 0;

      // Calculate current streak (consecutive days with at least one habit completed)
      const currentStreak = calculateCurrentStreak(recentCompletions || []);
      
      // Calculate best streak from habits
      const bestStreak = Math.max(...(habits?.map(h => h.best_streak) || [0]), 0);

      // Calculate perfect days (days where all habits were completed)
      const perfectDays = calculatePerfectDays(recentCompletions || [], habits || [], 30);

      setStats({
        totalHabits,
        completedToday,
        currentStreak,
        weeklyCompletion,
        bestStreak,
        perfectDays
      });
    } catch (error) {
      console.error('Error fetching habit stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const calculateCurrentStreak = (completions: HabitCompletion[]): number => {
    if (completions.length === 0) return 0;

    // Group completions by date
    const completionsByDate = completions.reduce((acc, completion) => {
      const date = completion.completed_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(completion);
      return acc;
    }, {} as Record<string, HabitCompletion[]>);

    let streak = 0;
    const today = new Date();
    
    // Check consecutive days backwards from today
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      if (completionsByDate[dateString] && completionsByDate[dateString].length > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculatePerfectDays = (completions: HabitCompletion[], habits: Habit[], days: number): number => {
    if (habits.length === 0) return 0;

    const completionsByDate = completions.reduce((acc, completion) => {
      const date = completion.completed_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(completion);
      return acc;
    }, {} as Record<string, HabitCompletion[]>);

    let perfectDays = 0;
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const dayCompletions = completionsByDate[dateString] || [];
      const uniqueHabits = new Set(dayCompletions.map(c => c.habit_id));
      
      if (uniqueHabits.size === habits.length) {
        perfectDays++;
      }
    }

    return perfectDays;
  };

  const getCompletionMessage = () => {
    const rate = stats.totalHabits > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0;
    
    if (rate === 100) return { message: "Perfect day! 🔥", color: "text-green-400" };
    if (rate >= 75) return { message: "Excellent progress! ⚡", color: "text-blue-400" };
    if (rate >= 50) return { message: "Good momentum! 💪", color: "text-yellow-400" };
    if (rate > 0) return { message: "Keep going! 🚀", color: "text-orange-400" };
    return { message: "Start your day! ✨", color: "text-white/70" };
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const completionMsg = getCompletionMessage();

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">📊 Live Stats</h3>
            <p className="text-sm text-white/70">Real-time progress</p>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Today's Completion</span>
            <span className="text-sm font-semibold text-white">{stats.completedToday}/{stats.totalHabits}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.totalHabits > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0}%` }}
            />
          </div>
          <p className={`text-sm font-semibold ${completionMsg.color}`}>
            {completionMsg.message}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-blue-400">{stats.currentStreak}</div>
            <div className="text-xs text-white/60">Current Streak</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-green-400">{stats.weeklyCompletion}%</div>
            <div className="text-xs text-white/60">Weekly Rate</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <Award className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">{stats.bestStreak}</div>
            <div className="text-xs text-white/60">Best Streak</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <span className="text-2xl block mb-2">🏆</span>
            <div className="text-2xl font-bold text-orange-400">{stats.perfectDays}</div>
            <div className="text-xs text-white/60">Perfect Days</div>
          </div>
        </div>

        {/* Motivational Tip */}
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
          <p className="text-sm font-semibold text-green-300">💡 Pro Tip</p>
          <p className="text-xs text-white/60 mt-1">
            {stats.currentStreak >= 7 
              ? "You're on fire! Keep the momentum going!" 
              : "Build small habits first - consistency beats intensity!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default FunctionalHabitStats; 