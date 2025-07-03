import React, { useState, useEffect } from 'react';
import { Target, Trophy, Calendar, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { supabase } from '@/integrations/supabase/client';

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

interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  progress: number;
  type: 'streak' | 'completion' | 'perfectDays' | 'consistency';
  color: string;
  icon: string;
}

const FunctionalHabitGoals = () => {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [nextMilestone, setNextMilestone] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuestMode) {
      setGuestGoals();
    } else if (user) {
      fetchGoals();
    }
  }, [user, isGuestMode, guestData]);

  const setGuestGoals = () => {
    // Simulate realistic goals for guest mode
    const guestGoals: Goal[] = [
      {
        id: '1',
        title: '7-Day Streak',
        description: 'Complete any habit for 7 consecutive days',
        current: 5,
        target: 7,
        progress: 71,
        type: 'streak',
        color: 'green',
        icon: '🔥'
      },
      {
        id: '2', 
        title: '30-Day Challenge',
        description: 'Log 30 total habit completions',
        current: 18,
        target: 30,
        progress: 60,
        type: 'completion',
        color: 'blue',
        icon: '🎯'
      },
      {
        id: '3',
        title: 'Perfect Week',
        description: 'Complete all habits for 7 consecutive days',
        current: 0,
        target: 1,
        progress: 0,
        type: 'perfectDays',
        color: 'purple',
        icon: '💎'
      },
      {
        id: '4',
        title: 'Consistency Master',
        description: 'Maintain 80% weekly completion rate',
        current: 78,
        target: 80,
        progress: 97,
        type: 'consistency',
        color: 'yellow',
        icon: '⚡'
      }
    ];

    setGoals(guestGoals);
    setNextMilestone('Complete 2 more days to achieve your 7-day streak! 🔥');
    setLoading(false);
  };

  const fetchGoals = async () => {
    if (!user || isGuestMode) return;

    try {
      setLoading(true);

      // Fetch habits and completions
      const [habitsResult, completionsResult] = await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('habit_completions')
          .select('*')
          .eq('user_id', user.id)
          .gte('completed_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      ]);

      const habits = habitsResult.data || [];
      const completions = completionsResult.data || [];

      if (habits.length === 0) {
        setLoading(false);
        return;
      }

      const calculatedGoals = calculateGoals(habits, completions);
      setGoals(calculatedGoals);
      setNextMilestone(generateNextMilestone(habits, completions, calculatedGoals));

    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGoals = (habits: Habit[], completions: HabitCompletion[]): Goal[] => {
    const goals: Goal[] = [];

    // Goal 1: Current Streak Goal (dynamic target based on best streak)
    const currentStreak = Math.max(...habits.map(h => h.current_streak || 0), 0);
    const bestStreak = Math.max(...habits.map(h => h.best_streak || 0), 0);
    const streakTarget = Math.max(7, bestStreak + 1, currentStreak + 3);
    
    goals.push({
      id: '1',
      title: `${streakTarget}-Day Streak`,
      description: `Maintain a habit streak for ${streakTarget} consecutive days`,
      current: currentStreak,
      target: streakTarget,
      progress: Math.min((currentStreak / streakTarget) * 100, 100),
      type: 'streak',
      color: 'green',
      icon: '🔥'
    });

    // Goal 2: Total Completions (30-day)
    const totalCompletions = completions.length;
    const completionTarget = Math.max(30, Math.ceil(habits.length * 20)); // 20 completions per habit
    
    goals.push({
      id: '2',
      title: '30-Day Challenge',
      description: `Complete ${completionTarget} total habits this month`,
      current: totalCompletions,
      target: completionTarget,
      progress: Math.min((totalCompletions / completionTarget) * 100, 100),
      type: 'completion',
      color: 'blue',
      icon: '🎯'
    });

    // Goal 3: Perfect Days (all habits completed in a single day)
    const perfectDays = calculatePerfectDays(habits, completions);
    
    goals.push({
      id: '3',
      title: 'Perfect Week',
      description: 'Complete all habits on the same day, 7 times',
      current: perfectDays,
      target: 7,
      progress: Math.min((perfectDays / 7) * 100, 100),
      type: 'perfectDays',
      color: 'purple',
      icon: '💎'
    });

    // Goal 4: Weekly Consistency
    const weeklyConsistency = calculateWeeklyConsistency(completions);
    
    goals.push({
      id: '4',
      title: 'Consistency Master',
      description: 'Maintain 85% weekly completion rate',
      current: weeklyConsistency,
      target: 85,
      progress: Math.min((weeklyConsistency / 85) * 100, 100),
      type: 'consistency',
      color: 'yellow',
      icon: '⚡'
    });

    return goals;
  };

  const calculatePerfectDays = (habits: Habit[], completions: HabitCompletion[]): number => {
    if (habits.length === 0) return 0;

    const completionsByDate = completions.reduce((acc, completion) => {
      const date = completion.completed_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(completion);
      return acc;
    }, {} as Record<string, HabitCompletion[]>);

    let perfectDays = 0;
    for (const [date, dayCompletions] of Object.entries(completionsByDate)) {
      const uniqueHabits = new Set(dayCompletions.map(c => c.habit_id));
      if (uniqueHabits.size === habits.length) {
        perfectDays++;
      }
    }

    return perfectDays;
  };

  const calculateWeeklyConsistency = (completions: HabitCompletion[]): number => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCompletions = completions.filter(c => 
      new Date(c.completed_date) >= sevenDaysAgo
    );

    const uniqueDays = new Set(recentCompletions.map(c => c.completed_date));
    return Math.round((uniqueDays.size / 7) * 100);
  };

  const generateNextMilestone = (habits: Habit[], completions: HabitCompletion[], goals: Goal[]): string => {
    // Find the goal that's closest to completion
    const sortedGoals = goals
      .filter(g => g.progress < 100)
      .sort((a, b) => b.progress - a.progress);

    if (sortedGoals.length === 0) {
      return 'Amazing! You\'ve achieved all current goals! 🏆';
    }

    const nextGoal = sortedGoals[0];
    const remaining = nextGoal.target - nextGoal.current;

    switch (nextGoal.type) {
      case 'streak':
        return `Keep going! ${remaining} more days to achieve your ${nextGoal.target}-day streak! 🔥`;
      case 'completion':
        return `You're so close! ${remaining} more completions to reach your monthly goal! 🎯`;
      case 'perfectDays':
        return `Aim for perfection! Complete all habits on ${remaining} more days! 💎`;
      case 'consistency':
        return `Almost there! ${remaining}% more consistency to become a master! ⚡`;
      default:
        return 'Keep pushing towards your goals! 🚀';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-500',
          border: 'border-green-500/20',
          text: 'text-green-300'
        };
      case 'blue':
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-500/20', 
          text: 'text-blue-300'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          border: 'border-purple-500/20',
          text: 'text-purple-300'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-500/20',
          text: 'text-yellow-300'
        };
      default:
        return {
          bg: 'bg-gray-500',
          border: 'border-gray-500/20',
          text: 'text-gray-300'
        };
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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🎯 Goals</h3>
            <p className="text-sm text-white/70">Achievement targets</p>
          </div>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const colorClasses = getColorClasses(goal.color);
            
            return (
              <div key={goal.id} className="p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{goal.icon}</span>
                    <span className="text-sm font-semibold text-white">{goal.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div 
                    className={`${colorClasses.bg} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>
                
                <p className="text-xs text-white/60">{goal.description}</p>
                
                {goal.progress >= 100 && (
                  <div className="mt-2 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">Completed! 🎉</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Milestone */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
          <p className="text-sm font-semibold text-green-300 flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Next Milestone
          </p>
          <p className="text-xs text-white/60 mt-1">
            {nextMilestone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FunctionalHabitGoals; 