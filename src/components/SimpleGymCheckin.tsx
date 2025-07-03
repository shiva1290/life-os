import React, { useState, useEffect } from 'react';
import { Dumbbell, Check, Timer, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getLocalDateString } from '@/lib/timeUtils';

const SimpleGymCheckin = () => {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const { toast } = useToast();
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusSessionCount, setFocusSessionCount] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState('25');

  useEffect(() => {
    if (isGuestMode) {
      setGuestStatus();
    } else if (user) {
      checkTodayStatus();
    }
  }, [user, isGuestMode, guestData]);

  const setGuestStatus = () => {
    const today = getLocalDateString();
    setCheckedInToday(guestData.gymCheckins.some(g => g.checkin_date === today));
    setFocusSessionCount(guestData.focusSessions?.length || 0);
    setLoading(false);
  };

  const checkTodayStatus = async () => {
    if (!user || isGuestMode) return;

    try {
      const today = getLocalDateString();
      
      // Check gym status
      const { data: gymData, error: gymError } = await supabase
        .from('gym_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .limit(1);

      if (gymError) throw gymError;
      setCheckedInToday(gymData && gymData.length > 0);

      // Get today's focus session count
      const { data: focusData, error: focusError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      if (focusError) throw focusError;
      setFocusSessionCount(focusData ? focusData.length : 0);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGymToggle = async () => {
    if (isGuestMode) {
      setCheckedInToday(!checkedInToday);
      toast({
        title: checkedInToday ? "🏋️ Gym check-in removed" : "🏋️ Gym session logged!",
        description: checkedInToday ? "Check-in has been undone" : "Great work crushing your workout today!",
      });
      return;
    }

    if (!user) return;

    try {
      const today = getLocalDateString();
      
      if (checkedInToday) {
        // Remove check-in
        const { error } = await supabase
          .from('gym_checkins')
          .delete()
          .eq('user_id', user.id)
          .eq('checkin_date', today);

        if (error) throw error;
        
        setCheckedInToday(false);
        toast({
          title: "🏋️ Gym check-in removed",
          description: "Check-in has been undone",
        });
      } else {
        // Add check-in
        const { error } = await supabase
          .from('gym_checkins')
          .insert([{
            user_id: user.id,
            checkin_date: today
          }]);

        if (error) throw error;
        
        setCheckedInToday(true);
        toast({
          title: "🏋️ Gym session logged!",
          description: "Great work crushing your workout today!",
        });
      }
    } catch (error) {
      console.error('Error toggling gym check-in:', error);
      toast({
        title: "Error",
        description: "Failed to update gym check-in. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddFocusSession = async () => {
    if (isGuestMode) {
      setFocusSessionCount(prev => prev + 1);
      toast({
        title: "⚡ Focus session added!",
        description: `${selectedDuration} minute session logged successfully!`,
      });
      return;
    }

    if (!user) return;

    try {
      const duration = parseInt(selectedDuration);
      const { error } = await supabase
        .from('focus_sessions')
        .insert([{
          user_id: user.id,
          session_type: 'focus',
          duration_minutes: duration,
          completed: true,
          notes: `${duration} minute focus session`
        }]);

      if (error) throw error;
      
      setFocusSessionCount(prev => prev + 1);
      toast({
        title: "⚡ Focus session added!",
        description: `${duration} minute session logged successfully!`,
      });
    } catch (error) {
      console.error('Error adding focus session:', error);
      toast({
        title: "Error",
        description: "Failed to add focus session. Please try again.",
        variant: "destructive"
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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🏋️ Gym & Focus</h3>
            <p className="text-sm text-white/70">Log your sessions</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Gym Section */}
          <div className="text-center">
            {checkedInToday ? (
              <div className="space-y-2">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl">
                  <Check className="w-6 h-6 mx-auto mb-1 text-green-400" />
                  <p className="text-green-300 font-semibold text-sm">✅ Gym Done!</p>
                  <p className="text-xs text-white/60">Great workout today</p>
                </div>
                <Button
                  onClick={handleGymToggle}
                  variant="outline"
                  size="sm"
                  className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove Check-in
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGymToggle}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 rounded-2xl transform hover:scale-105 transition-all"
              >
                🏋️ Gym Check-in
              </Button>
            )}
          </div>

          {/* Focus Sessions Section */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white/70">Focus Sessions</span>
              </div>
              <div className="px-2 py-1 bg-blue-500/20 rounded-lg">
                <span className="text-xs text-blue-300 font-semibold">{focusSessionCount} today</span>
              </div>
            </div>
            
            {/* Duration Selector */}
            <div className="mb-3">
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-full bg-slate-800/50 border-white/20 text-white text-sm h-9">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="15" className="text-white">15 minutes</SelectItem>
                  <SelectItem value="25" className="text-white">25 minutes (Pomodoro)</SelectItem>
                  <SelectItem value="30" className="text-white">30 minutes</SelectItem>
                  <SelectItem value="45" className="text-white">45 minutes</SelectItem>
                  <SelectItem value="60" className="text-white">60 minutes</SelectItem>
                  <SelectItem value="90" className="text-white">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAddFocusSession}
              variant="outline"
              className="w-full bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 py-2 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {selectedDuration}min Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGymCheckin; 