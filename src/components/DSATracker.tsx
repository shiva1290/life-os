import React, { useState, useEffect, useCallback } from 'react';
import { Code, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GuestModePopup from './GuestModePopup';
import { getLocalDateString, getLocalDateStringDaysAgo } from '@/lib/timeUtils';

interface DSAProblem {
  id: string;
  problem_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  solved_date: string;
}

const DSATracker = () => {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const { toast } = useToast();
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  useEffect(() => {
    if (isGuestMode) {
      const today = getLocalDateString();
      
      // Filter problems for today and this week
      const todayProblems = guestData.dsaProblems.filter(p => p.solved_date === today);
      setProblems(guestData.dsaProblems);
      setTodayCount(todayProblems.length);
      
      // Calculate weekly count (last 7 days)
      const weeklyProblems = guestData.dsaProblems.filter(p => {
        const problemDate = new Date(p.solved_date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return problemDate >= weekAgo;
      });
      setWeeklyCount(weeklyProblems.length);
      setStreakCount(5); // Sample guest streak
      setLoading(false);
    } else if (user) {
      fetchProblems();
    }
  }, [user, isGuestMode, guestData]);

  const fetchProblems = async () => {
    if (!user || isGuestMode) return;

    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekStartString = getLocalDateString(weekStart);

      const { data, error } = await supabase
        .from('dsa_problems')
        .select('*')
        .gte('solved_date', weekStartString);

      if (error) throw error;
      
      const today = getLocalDateString();
      const allProblems = data || [];
      const todayProblems = allProblems.filter(p => p.solved_date === today);
      
      setProblems(allProblems);
      setTodayCount(todayProblems.length);
      setWeeklyCount(allProblems.length);
      
      // Calculate streak
      const streak = await calculateDSAStreak();
      setStreakCount(streak);
    } catch (error) {
      console.error('Error fetching DSA problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDSAStreak = async () => {
    if (!user) return 0;

    try {
      const { data: problems, error } = await supabase
        .from('dsa_problems')
        .select('solved_date')
        .eq('user_id', user.id)
        .order('solved_date', { ascending: false });

      if (error) throw error;

      if (!problems || problems.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      const dates = problems.map(p => p.solved_date).filter(Boolean);
      const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      for (let i = 0; i < uniqueDates.length; i++) {
        const problemDate = new Date(uniqueDates[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (problemDate.toDateString() === expectedDate.toDateString()) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating DSA streak:', error);
      return 0;
    }
  };

  const setupRealtimeSubscription = useCallback(() => {
    if (!user) return;

    const channel = supabase
      .channel('dsa-tracker-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dsa_problems',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchProblems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (isGuestMode) {
      // Set sample guest data for DSA progress
      setTodayCount(2);
      setWeeklyCount(8);
      setStreakCount(5);
      setLoading(false);
    } else if (user) {
      fetchProblems();
      setupRealtimeSubscription();
    }
  }, [fetchProblems, setupRealtimeSubscription, isGuestMode, user]);

  const addDSAProblem = async () => {
    if (isGuestMode) {
      setShowGuestPopup(true);
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase
        .from('dsa_problems')
                  .insert([{
            problem_name: `Problem ${todayCount + 1}`,
            user_id: user.id,
            solved_date: getLocalDateString()
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "DSA problem added successfully",
      });

      // Data will be updated through real-time subscription
    } catch (error) {
      console.error('Error adding DSA problem:', error);
      toast({
        title: "Error",
        description: "Failed to add DSA problem",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">💻 DSA Progress</h3>
          <p className="text-sm text-white/70">Keep the streak alive!</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-3xl font-bold text-green-400">{todayCount}</div>
          <div className="text-xs text-white/70">Today</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-3xl font-bold text-blue-400">{weeklyCount}</div>
          <div className="text-xs text-white/70">This Week</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-3xl font-bold text-orange-400">{streakCount}</div>
          <div className="text-xs text-white/70">Day Streak</div>
        </div>
      </div>
      
      <button
        onClick={addDSAProblem}
        className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-5 h-5" />
        + Solved a Problem
      </button>

      <GuestModePopup
        isOpen={showGuestPopup}
        onClose={() => setShowGuestPopup(false)}
        title="Track your coding journey!"
        message="Create your account to track your DSA progress and maintain your problem-solving streak!"
      />
    </div>
  );
};

export default DSATracker;
