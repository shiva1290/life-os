
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyStats {
  dsaProblems: number;
  gymSessions: number;
  completedTasks: number;
  focusSessions: number;
  totalBlocks: number;
  completedBlocks: number;
}

const WeeklyProgress = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<WeeklyStats>({
    dsaProblems: 0,
    gymSessions: 0,
    completedTasks: 0,
    focusSessions: 0,
    totalBlocks: 0,
    completedBlocks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWeeklyStats();
    }
  }, [user]);

  const fetchWeeklyStats = async () => {
    if (!user) return;

    try {
      const weekStart = getWeekStart(new Date());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      // Fetch DSA problems
      const { data: dsaData } = await supabase
        .from('dsa_problems')
        .select('*')
        .gte('solved_date', weekStart.toISOString().split('T')[0])
        .lt('solved_date', weekEnd.toISOString().split('T')[0]);

      // Fetch gym sessions
      const { data: gymData } = await supabase
        .from('gym_checkins')
        .select('*')
        .gte('checkin_date', weekStart.toISOString().split('T')[0])
        .lt('checkin_date', weekEnd.toISOString().split('T')[0]);

      // Fetch completed tasks
      const { data: tasksData } = await supabase
        .from('todos')
        .select('*')
        .eq('completed', true)
        .gte('created_date', weekStart.toISOString().split('T')[0])
        .lt('created_date', weekEnd.toISOString().split('T')[0]);

      // Fetch focus sessions
      const { data: focusData } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('completed', true)
        .gte('created_at', weekStart.toISOString())
        .lt('created_at', weekEnd.toISOString());

      // Fetch daily blocks
      const { data: blocksData } = await supabase
        .from('daily_blocks')
        .select('*')
        .gte('date', weekStart.toISOString().split('T')[0])
        .lt('date', weekEnd.toISOString().split('T')[0]);

      setStats({
        dsaProblems: dsaData?.length || 0,
        gymSessions: gymData?.length || 0,
        completedTasks: tasksData?.length || 0,
        focusSessions: focusData?.length || 0,
        totalBlocks: blocksData?.length || 0,
        completedBlocks: blocksData?.filter(b => b.completed).length || 0
      });
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
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

  const getCompletionRate = () => {
    if (stats.totalBlocks === 0) return 0;
    return Math.round((stats.completedBlocks / stats.totalBlocks) * 100);
  };

  const getWeeklyScore = () => {
    const weights = {
      dsa: 30,
      gym: 25,
      tasks: 20,
      focus: 15,
      blocks: 10
    };

    const scores = {
      dsa: Math.min(stats.dsaProblems * 5, weights.dsa),
      gym: Math.min(stats.gymSessions * 5, weights.gym),
      tasks: Math.min(stats.completedTasks * 2, weights.tasks),
      focus: Math.min(stats.focusSessions * 3, weights.focus),
      blocks: Math.min(getCompletionRate() / 10, weights.blocks)
    };

    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const weeklyScore = getWeeklyScore();
  const completionRate = getCompletionRate();

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">📊 Weekly Progress</h3>
            <p className="text-sm text-white/70">Your execution summary</p>
          </div>
        </div>

        {/* Weekly Score */}
        <div className="text-center mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl">
          <div className="text-4xl font-bold text-white mb-2">{Math.round(weeklyScore)}</div>
          <div className="text-sm text-white/70">Weekly Score</div>
          <div className={`text-xs mt-1 ${
            weeklyScore >= 80 ? 'text-green-400' :
            weeklyScore >= 60 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {weeklyScore >= 80 ? '🔥 Operator Level' :
             weeklyScore >= 60 ? '⚡ Good Progress' :
             '💪 Keep Pushing'}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-blue-400">{stats.dsaProblems}</div>
            <div className="text-xs text-white/60">DSA Problems</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-green-400">{stats.gymSessions}</div>
            <div className="text-xs text-white/60">Gym Sessions</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-purple-400">{stats.focusSessions}</div>
            <div className="text-xs text-white/60">Focus Sessions</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-orange-400">{stats.completedTasks}</div>
            <div className="text-xs text-white/60">Tasks Done</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Block Completion</span>
            <span className="text-sm font-semibold text-white">{completionRate}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                completionRate >= 80 ? 'bg-green-500' :
                completionRate >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Achievement Badge */}
        {weeklyScore >= 80 && (
          <div className="text-center p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl">
            <Award className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <p className="text-sm font-semibold text-yellow-300">🏆 Operator Achievement Unlocked!</p>
            <p className="text-xs text-white/60">Elite execution this week</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyProgress;
