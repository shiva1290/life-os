
import React, { useState, useEffect } from 'react';
import { Calendar, Code, Dumbbell, Moon, Coffee } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyData {
  date: string;
  coding_done: boolean;
  gym_done: boolean;
  sleep_good: boolean;
  diet_good: boolean;
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
        
        // Check if coding was done (DSA problems or focus sessions)
        const [dsaResult, focusResult, gymResult, todosResult] = await Promise.all([
          supabase
            .from('dsa_problems')
            .select('id')
            .eq('user_id', user.id)
            .eq('solved_date', dateStr),
          
          supabase
            .from('focus_sessions')
            .select('id')
            .eq('user_id', user.id)
            .eq('completed', true)
            .gte('created_at', dateStr)
            .lt('created_at', new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString()),
          
          supabase
            .from('gym_checkins')
            .select('id')
            .eq('user_id', user.id)
            .eq('checkin_date', dateStr),
          
          supabase
            .from('todos')
            .select('text')
            .eq('user_id', user.id)
            .eq('created_date', dateStr)
            .eq('completed', true)
        ]);

        const codingDone = (dsaResult.data?.length || 0) > 0 || (focusResult.data?.length || 0) > 0;
        const gymDone = (gymResult.data?.length || 0) > 0;
        
        // Check for sleep and diet related completed todos
        const completedTodos = todosResult.data || [];
        const sleepGood = completedTodos.some(todo => 
          todo.text.toLowerCase().includes('sleep') || 
          todo.text.toLowerCase().includes('bed') ||
          todo.text.toLowerCase().includes('rest') ||
          todo.text.toLowerCase().includes('8 hours')
        );
        
        const dietGood = completedTodos.some(todo => 
          todo.text.toLowerCase().includes('water') || 
          todo.text.toLowerCase().includes('meal') ||
          todo.text.toLowerCase().includes('protein') ||
          todo.text.toLowerCase().includes('diet') ||
          todo.text.toLowerCase().includes('breakfast') ||
          todo.text.toLowerCase().includes('lunch') ||
          todo.text.toLowerCase().includes('dinner')
        );

        weekData.push({
          date: dateStr,
          coding_done: codingDone,
          gym_done: gymDone,
          sleep_good: sleepGood,
          diet_good: dietGood
        });
      }

      setWeeklyData(weekData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en', { weekday: 'short' });
  };

  const getCompletionColor = (completed: boolean) => {
    return completed ? 'bg-green-500' : 'bg-white/20';
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
      <div className="space-y-3 mb-6">
        {weeklyData.map((day) => (
          <div key={day.date} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
            <div className="text-center min-w-[60px]">
              <div className="text-sm font-semibold text-white">{getDayName(day.date)}</div>
              <div className="text-xs text-white/60">{day.date.split('-')[2]}</div>
            </div>
            
            <div className="flex-1 grid grid-cols-4 gap-4">
              {/* Coding */}
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getCompletionColor(day.coding_done)}`}>
                  {day.coding_done && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>

              {/* Gym */}
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-green-400" />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getCompletionColor(day.gym_done)}`}>
                  {day.gym_done && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>

              {/* Sleep */}
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getCompletionColor(day.sleep_good)}`}>
                  {day.sleep_good && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>

              {/* Diet */}
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-orange-400" />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getCompletionColor(day.diet_good)}`}>
                  {day.diet_good && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
            </div>

            {/* Completion Score */}
            <div className="text-center min-w-[60px]">
              <div className="text-sm font-bold text-white">
                {[day.coding_done, day.gym_done, day.sleep_good, day.diet_good].filter(Boolean).length}/4
              </div>
              <div className="text-xs text-white/60">Complete</div>
            </div>
          </div>
        ))}
      </div>

      {/* Week Summary */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {weeklyData.filter(day => day.coding_done).length}
          </div>
          <div className="text-xs text-white/60">Coding</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {weeklyData.filter(day => day.gym_done).length}
          </div>
          <div className="text-xs text-white/60">Gym</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {weeklyData.filter(day => day.sleep_good).length}
          </div>
          <div className="text-xs text-white/60">Sleep</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {weeklyData.filter(day => day.diet_good).length}
          </div>
          <div className="text-xs text-white/60">Diet</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOperatorGrid;
