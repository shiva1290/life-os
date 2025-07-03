import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { supabase } from '@/integrations/supabase/client';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
}

interface HabitInsight {
  bestHabit: { habit: Habit | null; completionRate: number; };
  needsAttention: { habit: Habit | null; completionRate: number; };
  weeklyConsistency: number;
  topCategory: string;
  longestStreak: number;
  recentTrend: 'improving' | 'declining' | 'stable';
}

const FunctionalHabitInsights = () => {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const [insights, setInsights] = useState<HabitInsight>({
    bestHabit: { habit: null, completionRate: 0 },
    needsAttention: { habit: null, completionRate: 0 },
    weeklyConsistency: 0,
    topCategory: 'health',
    longestStreak: 0,
    recentTrend: 'stable'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuestMode) {
      setGuestInsights();
    } else if (user) {
      fetchInsights();
    }
  }, [user, isGuestMode, guestData]);

  const setGuestInsights = () => {
    const habits = guestData.habits;
    
    if (habits.length === 0) {
      setLoading(false);
      return;
    }

    // Simulate realistic insights for guest mode
    const bestHabit = habits.find(h => h.name === 'Morning Prayer') || habits[0];
    const needsAttention = habits.find(h => h.name === 'DSA Problems') || habits[habits.length - 1];

    setInsights({
      bestHabit: { habit: bestHabit, completionRate: 0.92 },
      needsAttention: { habit: needsAttention, completionRate: 0.35 },
      weeklyConsistency: 78,
      topCategory: 'spiritual',
      longestStreak: 12,
      recentTrend: 'improving'
    });
    setLoading(false);
  };

  const fetchInsights = async () => {
    if (!user || isGuestMode) return;

    try {
      setLoading(true);

      // Fetch all habits
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (habitsError) throw habitsError;

      if (!habits || habits.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch completions for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_date', thirtyDaysAgo.toISOString().split('T')[0]);

      if (completionsError) throw completionsError;

      // Calculate insights
      const calculatedInsights = calculateInsights(habits, completions || []);
      setInsights(calculatedInsights);

    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateInsights = (habits: Habit[], completions: HabitCompletion[]): HabitInsight => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Calculate completion rates for each habit over the last 7 days
    const habitRates = habits.map(habit => {
      const habitCompletions = completions.filter(c => 
        c.habit_id === habit.id &&
        new Date(c.completed_date) >= sevenDaysAgo
      );
      const completionRate = habitCompletions.length / 7; // 7 days
      return { habit, completionRate };
    });

    // Find best and worst performing habits
    const sortedByRate = [...habitRates].sort((a, b) => b.completionRate - a.completionRate);
    const bestHabit = sortedByRate[0] || { habit: null, completionRate: 0 };
    const needsAttention = sortedByRate[sortedByRate.length - 1] || { habit: null, completionRate: 0 };

    // Calculate weekly consistency (percentage of days with at least one habit completed)
    const completionsByDate = completions.reduce((acc, completion) => {
      const date = completion.completed_date;
      if (new Date(date) >= sevenDaysAgo) {
        acc.add(date);
      }
      return acc;
    }, new Set<string>());

    const weeklyConsistency = Math.round((completionsByDate.size / 7) * 100);

    // Find top category
    const categoryCount = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'health';

    // Calculate longest current streak
    const longestStreak = Math.max(...habits.map(h => h.current_streak || 0), 0);

    // Calculate recent trend (last 7 days vs previous 7 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const recentWeekCompletions = completions.filter(c => 
      new Date(c.completed_date) >= sevenDaysAgo
    ).length;

    const previousWeekCompletions = completions.filter(c => {
      const date = new Date(c.completed_date);
      return date >= fourteenDaysAgo && date < sevenDaysAgo;
    }).length;

    let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentWeekCompletions > previousWeekCompletions + 2) recentTrend = 'improving';
    else if (previousWeekCompletions > recentWeekCompletions + 2) recentTrend = 'declining';

    return {
      bestHabit,
      needsAttention,
      weeklyConsistency,
      topCategory,
      longestStreak,
      recentTrend
    };
  };

  const getTrendIcon = () => {
    switch (insights.recentTrend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '📊';
    }
  };

  const getTrendColor = () => {
    switch (insights.recentTrend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getTrendMessage = () => {
    switch (insights.recentTrend) {
      case 'improving': return 'You\'re improving!';
      case 'declining': return 'Needs focus';
      default: return 'Steady progress';
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🧠 Insights</h3>
            <p className="text-sm text-white/70">Habit patterns & analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Best Performing Habit */}
          <div className="p-4 bg-white/5 rounded-2xl">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Best Performing Habit
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{insights.bestHabit.habit?.icon || '💪'}</span>
                <span className="text-sm text-white/70">
                  {insights.bestHabit.habit?.name || 'No habits yet'}
                </span>
              </div>
              <div className="text-green-400 font-semibold text-sm">
                {Math.round(insights.bestHabit.completionRate * 100)}%
              </div>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="p-4 bg-white/5 rounded-2xl">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Needs Attention
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{insights.needsAttention.habit?.icon || '⚠️'}</span>
                <span className="text-sm text-white/70">
                  {insights.needsAttention.habit?.name || 'All habits doing well'}
                </span>
              </div>
              <div className="text-orange-400 font-semibold text-sm">
                {Math.round(insights.needsAttention.completionRate * 100)}%
              </div>
            </div>
          </div>

          {/* Weekly Consistency */}
          <div className="p-4 bg-white/5 rounded-2xl">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Weekly Consistency
            </h4>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-400">{insights.weeklyConsistency}%</div>
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                <span className="text-lg">{getTrendIcon()}</span>
                <span className="text-sm font-medium">{getTrendMessage()}</span>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${insights.weeklyConsistency}%` }}
              />
            </div>
          </div>

          {/* Top Category & Streak */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-2xl text-center">
              <div className="text-lg mb-1">🏆</div>
              <div className="text-sm font-semibold text-white capitalize">{insights.topCategory}</div>
              <div className="text-xs text-white/60">Top Category</div>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl text-center">
              <div className="text-lg mb-1">🔥</div>
              <div className="text-sm font-semibold text-white">{insights.longestStreak} days</div>
              <div className="text-xs text-white/60">Best Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionalHabitInsights; 