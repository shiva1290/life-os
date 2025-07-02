
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
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gym</h3>
            <p className="text-xs text-white/60">Daily check-in</p>
          </div>
        </div>

        <div className="text-center mb-4">
          <Button
            onClick={toggleCheckin}
            variant={checkedIn ? "secondary" : "default"}
            className={`w-full py-3 text-sm font-medium transition-all duration-200 ${
              checkedIn
                ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            }`}
          >
            {checkedIn ? '✅ Completed' : '💪 Check In'}
          </Button>
        </div>

        {/* Minimal Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <div className="text-xl font-bold text-white">{streak}</div>
            <div className="text-xs text-white/60">Streak</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <div className="text-xl font-bold text-white">
              {checkedIn ? '1' : '0'}
            </div>
            <div className="text-xs text-white/60">Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymCheckIn;
