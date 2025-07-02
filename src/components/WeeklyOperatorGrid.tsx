
import React, { useState, useEffect } from 'react';
import { Calendar, Target, Dumbbell, Moon, Code } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyData {
  date: string;
  dsa_blocks: number;
  dev_blocks: number;
  gym_done: boolean;
  sleep_hours: number;
  execution_score: number;
}

const WeeklyOperatorGrid = () => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWeeklyData();
    }
  }, [user]);

  const fetchWeeklyData = async () => {
    if (!user) return;

    try {
      const weekData = [];
      const today = new Date();
      
      // Get last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Fetch various data for this date
        const { data: dsaData } = await supabase
          .from('dsa_problems')
          .select('*')
          .eq('solved_date', dateStr);

        const { data: gymData } = await supabase
          .from('gym_checkins')
          .select('*')
          .eq('checkin_date', dateStr);

        const { data: focusData } = await supabase
          .from('focus_sessions')
          .select('*')
          .gte('created_at', dateStr)
          .lt('created_at', new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString());

        const dsaBlocks = dsaData?.length || 0;
        const devBlocks = focusData?.filter(f => f.session_type === 'dev').length || 0;
        const gymDone = (gymData?.length || 0) > 0;
        
        // Calculate execution score (0-100)
        let score = 0;
        if (dsaBlocks > 0) score += 30;
        if (devBlocks > 0) score += 20;
        if (gymDone) score += 30;
        if (Math.random() > 0.3) score += 20; // Simulate sleep data

        weekData.push({
          date: dateStr,
          dsa_blocks: dsaBlocks,
          dev_blocks: devBlocks,
          gym_done: gymDone,
          sleep_hours: 7 + Math.random() * 2, // Simulate sleep hours
          execution_score: score
        });
      }

      setWeeklyData(weekData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en', { weekday: 'short' });
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
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-white" />
        <div>
          <h3 className="text-xl font-bold text-white">📅 Weekly Operator Grid</h3>
          <p className="text-sm text-white/70">7-day execution overview</p>
        </div>
      </div>

      {/* Week Grid */}
      <div className="space-y-4 mb-6">
        {weeklyData.map((day, index) => (
          <div key={day.date} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
            <div className="text-center min-w-[60px]">
              <div className="text-sm font-semibold text-white">{getDayName(day.date)}</div>
              <div className="text-xs text-white/60">{day.date.split('-')[2]}</div>
            </div>
            
            <div className="flex-1 grid grid-cols-4 gap-3">
              {/* DSA Blocks */}
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <div className="flex gap-1">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < day.dsa_blocks ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Dev Blocks */}
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <div className="flex gap-1">
                  {Array.from({ length: 2 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < day.dev_blocks ? 'bg-purple-500' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Gym */}
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-green-400" />
                <div className={`w-6 h-6 rounded-full ${day.gym_done ? 'bg-green-500' : 'bg-white/20'}`} />
              </div>

              {/* Sleep */}
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <div className="text-xs text-white/80">{day.sleep_hours.toFixed(1)}h</div>
              </div>
            </div>

            {/* Execution Score */}
            <div className="text-center min-w-[80px]">
              <div className={`w-16 h-3 rounded-full ${getScoreColor(day.execution_score)}`} />
              <div className="text-xs text-white/60 mt-1">{day.execution_score}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Week Summary */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {weeklyData.reduce((sum, day) => sum + day.dsa_blocks, 0)}
          </div>
          <div className="text-xs text-white/60">DSA Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {weeklyData.reduce((sum, day) => sum + day.dev_blocks, 0)}
          </div>
          <div className="text-xs text-white/60">Dev Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {weeklyData.filter(day => day.gym_done).length}
          </div>
          <div className="text-xs text-white/60">Gym Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {(weeklyData.reduce((sum, day) => sum + day.sleep_hours, 0) / weeklyData.length).toFixed(1)}
          </div>
          <div className="text-xs text-white/60">Avg Sleep</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOperatorGrid;
