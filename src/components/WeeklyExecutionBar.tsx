
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const WeeklyExecutionBar = () => {
  const { user } = useAuth();
  const [weeklyStats, setWeeklyStats] = useState({
    completedBlocks: 0,
    totalBlocks: 0,
    percentage: 0
  });
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWeeklyStats();
      checkIfEndOfWeek();
    }
  }, [user]);

  const fetchWeeklyStats = async () => {
    if (!user) return;

    try {
      const startOfWeek = getStartOfWeek();
      const endOfWeek = getEndOfWeek();

      const { data, error } = await supabase
        .from('daily_blocks')
        .select('completed')
        .eq('user_id', user.id)
        .gte('date', startOfWeek)
        .lte('date', endOfWeek);

      if (error) throw error;

      const totalBlocks = data?.length || 0;
      const completedBlocks = data?.filter(block => block.completed).length || 0;
      const percentage = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

      setWeeklyStats({
        completedBlocks,
        totalBlocks,
        percentage
      });
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  };

  const getStartOfWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return startOfWeek.toISOString().split('T')[0];
  };

  const getEndOfWeek = () => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    return endOfWeek.toISOString().split('T')[0];
  };

  const checkIfEndOfWeek = () => {
    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    const isEvening = today.getHours() >= 18;
    
    if (isWeekend && isEvening) {
      setShowWeeklyReport(true);
    }
  };

  const getStatusMessage = () => {
    if (weeklyStats.percentage >= 90) {
      return {
        message: "You're becoming unstoppable.",
        color: "text-green-400",
        glow: "shadow-lg shadow-green-500/20"
      };
    } else if (weeklyStats.percentage < 70) {
      return {
        message: "This wasn't your best week — fix it now.",
        color: "text-red-400",
        glow: "shadow-lg shadow-red-500/20"
      };
    } else {
      return {
        message: "Solid execution. Push for excellence.",
        color: "text-blue-400",
        glow: "shadow-lg shadow-blue-500/20"
      };
    }
  };

  const status = getStatusMessage();

  if (!showWeeklyReport && weeklyStats.totalBlocks === 0) {
    return null;
  }

  return (
    <div className={`glass-card rounded-3xl p-6 mb-8 transition-all duration-300 ${status.glow}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl">📊</div>
        <h3 className="text-xl font-bold text-white">Weekly Execution</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Blocks Completed</span>
          <span className="text-white font-bold">{weeklyStats.completedBlocks}/{weeklyStats.totalBlocks}</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              weeklyStats.percentage >= 90 
                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                : weeklyStats.percentage < 70
                ? 'bg-gradient-to-r from-red-400 to-red-500'
                : 'bg-gradient-to-r from-blue-400 to-blue-500'
            }`}
            style={{ width: `${weeklyStats.percentage}%` }}
          />
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">{weeklyStats.percentage}%</div>
          <p className={`text-lg font-medium ${status.color}`}>
            {status.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyExecutionBar;
