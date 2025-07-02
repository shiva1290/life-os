
import React, { useState, useEffect } from 'react';
import { Code, Dumbbell, BookOpen } from 'lucide-react';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const StreakCounters = () => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState({
    dsa: 0,
    gym: 0,
    reflection: 0
  });
  const [brokenStreaks, setBrokenStreaks] = useState({
    dsa: false,
    gym: false,
    reflection: false
  });

  useEffect(() => {
    if (user) {
      fetchStreaks();
    }
  }, [user]);

  const fetchStreaks = async () => {
    if (!user) return;

    try {
      // Calculate DSA streak
      const dsaStreak = await calculateDSAStreak();
      
      // Calculate Gym streak
      const gymStreak = await calculateGymStreak();
      
      // Calculate Reflection streak
      const reflectionStreak = await calculateReflectionStreak();

      setStreaks({
        dsa: dsaStreak,
        gym: gymStreak,
        reflection: reflectionStreak
      });

      // Check if any streaks were broken today
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Check if user had activity yesterday but not today
      const [dsaToday, gymToday, reflectionToday] = await Promise.all([
        checkDSAActivity(today),
        checkGymActivity(today),
        checkReflectionActivity(today)
      ]);

      const [dsaYesterday, gymYesterday, reflectionYesterday] = await Promise.all([
        checkDSAActivity(yesterday),
        checkGymActivity(yesterday),
        checkReflectionActivity(yesterday)
      ]);

      setBrokenStreaks({
        dsa: dsaYesterday && !dsaToday && new Date().getHours() > 20,
        gym: gymYesterday && !gymToday && new Date().getHours() > 20,
        reflection: reflectionYesterday && !reflectionToday && new Date().getHours() > 22
      });

    } catch (error) {
      console.error('Error fetching streaks:', error);
    }
  };

  const calculateDSAStreak = async () => {
    const { data, error } = await supabase
      .from('dsa_problems')
      .select('solved_date')
      .eq('user_id', user?.id)
      .order('solved_date', { ascending: false });

    if (error || !data) return 0;

    const dates = [...new Set(data.map(p => p.solved_date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateGymStreak = async () => {
    const { data, error } = await supabase
      .from('gym_checkins')
      .select('checkin_date')
      .eq('user_id', user?.id)
      .order('checkin_date', { ascending: false });

    if (error || !data) return 0;

    const dates = [...new Set(data.map(c => c.checkin_date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateReflectionStreak = async () => {
    const { data, error } = await supabase
      .from('reflections')
      .select('date')
      .eq('user_id', user?.id)
      .eq('reflection_type', 'night')
      .order('date', { ascending: false });

    if (error || !data) return 0;

    const dates = [...new Set(data.map(r => r.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const checkDSAActivity = async (date: string) => {
    const { data } = await supabase
      .from('dsa_problems')
      .select('id')
      .eq('user_id', user?.id)
      .eq('solved_date', date)
      .limit(1);
    
    return data && data.length > 0;
  };

  const checkGymActivity = async (date: string) => {
    const { data } = await supabase
      .from('gym_checkins')
      .select('id')
      .eq('user_id', user?.id)
      .eq('checkin_date', date)
      .limit(1);
    
    return data && data.length > 0;
  };

  const checkReflectionActivity = async (date: string) => {
    const { data } = await supabase
      .from('reflections')
      .select('id')
      .eq('user_id', user?.id)
      .eq('reflection_type', 'night')
      .eq('date', date)
      .limit(1);
    
    return data && data.length > 0;
  };

  return (
    <div className="glass-card rounded-3xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl">🔥</div>
        <h3 className="text-xl font-bold text-white">Streak Counters</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl text-center transition-all duration-300 ${
          brokenStreaks.dsa 
            ? 'bg-red-500/20 border border-red-500/50 shadow-lg shadow-red-500/20' 
            : 'bg-white/5 border border-white/10'
        }`}>
          <Code className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">{streaks.dsa}</div>
          <div className="text-xs text-white/70">DSA Days</div>
        </div>
        
        <div className={`p-4 rounded-2xl text-center transition-all duration-300 ${
          brokenStreaks.gym 
            ? 'bg-red-500/20 border border-red-500/50 shadow-lg shadow-red-500/20' 
            : 'bg-white/5 border border-white/10'
        }`}>
          <Dumbbell className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">{streaks.gym}</div>
          <div className="text-xs text-white/70">Gym Days</div>
        </div>
        
        <div className={`p-4 rounded-2xl text-center transition-all duration-300 ${
          brokenStreaks.reflection 
            ? 'bg-red-500/20 border border-red-500/50 shadow-lg shadow-red-500/20' 
            : 'bg-white/5 border border-white/10'
        }`}>
          <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">{streaks.reflection}</div>
          <div className="text-xs text-white/70">Reflection Days</div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounters;
