
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface StreakData {
  date: string;
  dsa_count: number;
  gym_done: boolean;
  habits_completed: number;
  total_habits: number;
  intensity: number; // 0-4 for color intensity
}

const GitHubStyleStreaks = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user]);

  const fetchStreakData = async () => {
    if (!user) return;

    try {
      // Generate last 365 days
      const days = [];
      const today = new Date();
      
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Fetch DSA problems for this date
        const { data: dsaData } = await supabase
          .from('dsa_problems')
          .select('*')
          .eq('user_id', user.id)
          .eq('solved_date', dateStr);

        // Fetch gym checkins for this date
        const { data: gymData } = await supabase
          .from('gym_checkins')
          .select('*')
          .eq('user_id', user.id)
          .eq('checkin_date', dateStr);

        // Fetch habit completions for this date
        const { data: habitData } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed_date', dateStr);

        // Fetch total habits (simplified - assume 5 core habits)
        const totalHabits = 5;
        const completedHabits = habitData?.length || 0;
        
        // Calculate intensity (0-4 based on activity)
        let intensity = 0;
        if (dsaData && dsaData.length > 0) intensity += 1;
        if (gymData && gymData.length > 0) intensity += 1;
        if (completedHabits > 0) intensity += Math.min(2, Math.ceil(completedHabits / totalHabits * 2));

        days.push({
          date: dateStr,
          dsa_count: dsaData?.length || 0,
          gym_done: (gymData?.length || 0) > 0,
          habits_completed: completedHabits,
          total_habits: totalHabits,
          intensity: Math.min(4, intensity)
        });
      }

      setStreakData(days);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-slate-800';
      case 1: return 'bg-green-900';
      case 2: return 'bg-green-700';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-300';
      default: return 'bg-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🔥 Operator Streaks</h2>
        <p className="text-sm text-white/70">Your daily execution heatmap</p>
      </div>

      {/* GitHub-style grid */}
      <div className="mb-6">
        <div className="grid grid-cols-53 gap-[2px] mb-4">
          {streakData.map((day, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)} transition-all hover:scale-110 cursor-pointer`}
              title={`${day.date}: ${day.dsa_count} DSA, ${day.gym_done ? 'Gym ✓' : 'No Gym'}, ${day.habits_completed}/${day.total_habits} habits`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-slate-800" />
            <div className="w-3 h-3 rounded-sm bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-300" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {streakData.filter(d => d.dsa_count > 0).length}
          </div>
          <div className="text-xs text-white/60">DSA Days</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {streakData.filter(d => d.gym_done).length}
          </div>
          <div className="text-xs text-white/60">Gym Days</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {streakData.filter(d => d.intensity >= 3).length}
          </div>
          <div className="text-xs text-white/60">Perfect Days</div>
        </div>
      </div>
    </div>
  );
};

export default GitHubStyleStreaks;
