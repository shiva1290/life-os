
import React, { useState, useEffect } from 'react';
import { Dumbbell, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const GymCheckIn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkTodayStatus();
      calculateStreak();
    }
  }, [user]);

  const checkTodayStatus = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('gym_checkins')
        .select('*')
        .eq('checkin_date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCheckedIn(!!data);
    } catch (error) {
      console.error('Error checking gym status:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gym_checkins')
        .select('checkin_date')
        .order('checkin_date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setStreak(0);
        return;
      }

      // Calculate consecutive days
      let currentStreak = 0;
      const today = new Date();
      const dates = data.map(d => new Date(d.checkin_date));

      for (let i = 0; i < dates.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toISOString().split('T')[0];
        
        const hasCheckin = dates.some(d => d.toISOString().split('T')[0] === checkDateStr);
        
        if (hasCheckin) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    }
  };

  const toggleCheckin = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      if (checkedIn) {
        // Remove checkin
        const { error } = await supabase
          .from('gym_checkins')
          .delete()
          .eq('user_id', user.id)
          .eq('checkin_date', today);

        if (error) throw error;
        setCheckedIn(false);
        calculateStreak();
        
        toast({
          title: "Gym check-in removed",
          description: "Hope you get back to it soon!",
        });
      } else {
        // Add checkin
        const { error } = await supabase
          .from('gym_checkins')
          .insert([{
            user_id: user.id,
            checkin_date: today
          }]);

        if (error) throw error;
        setCheckedIn(true);
        calculateStreak();
        
        toast({
          title: "🔥 Gym session logged!",
          description: "Another step towards your transformation!",
        });
      }
    } catch (error) {
      console.error('Error toggling gym checkin:', error);
      toast({
        title: "Error",
        description: "Failed to update gym check-in",
        variant: "destructive",
      });
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
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🏋️ Gym Tracker</h3>
            <p className="text-sm text-white/70">Build strength, build discipline</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {checkedIn ? '💪' : '😴'}
          </div>
          <Button
            onClick={toggleCheckin}
            className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
              checkedIn
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white animate-pulse'
            }`}
          >
            {checkedIn ? '✅ Gym Completed Today!' : '🔥 Check In to Gym'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <div className="text-3xl font-bold text-green-400">{streak}</div>
            <div className="text-xs text-white/70">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl">
            <div className="text-3xl font-bold text-blue-400">
              {checkedIn ? '1' : '0'}
            </div>
            <div className="text-xs text-white/70">Today</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl">
          <p className="text-sm text-white/80 text-center">
            {checkedIn
              ? "💪 Beast mode activated! Your future self thanks you."
              : "🔥 Every rep builds the operator within. Time to execute."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GymCheckIn;
