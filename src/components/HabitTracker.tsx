
import React, { useState, useEffect } from 'react';
import { Calendar, Check, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface Habit {
  id: string;
  name: string;
  category: string;
  color: string;
  current_streak: number;
  best_streak: number;
  target_frequency: number;
  icon: string;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
}

const HabitTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'health',
    color: '#3B82F6',
    icon: '💪'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchCompletions();
    }
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const fetchCompletions = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('completed_date', today);

      if (error) throw error;
      setCompletions(data || []);
    } catch (error) {
      console.error('Error fetching completions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!user || !newHabit.name) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          name: newHabit.name,
          category: newHabit.category,
          color: newHabit.color,
          icon: newHabit.icon,
          user_id: user.id,
          current_streak: 0,
          best_streak: 0,
          target_frequency: 1
        }])
        .select()
        .single();

      if (error) throw error;
      setHabits(prev => [...prev, data]);
      setNewHabit({ name: '', category: 'health', color: '#3B82F6', icon: '💪' });
      setIsAddingHabit(false);
      
      toast({
        title: "Success!",
        description: "Habit added successfully",
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive",
      });
    }
  };

  const toggleHabit = async (habitId: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const existingCompletion = completions.find(c => c.habit_id === habitId);

    try {
      if (existingCompletion) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existingCompletion.id);

        if (error) throw error;
        setCompletions(prev => prev.filter(c => c.id !== existingCompletion.id));
      } else {
        // Add completion
        const { data, error } = await supabase
          .from('habit_completions')
          .insert([{
            habit_id: habitId,
            user_id: user.id,
            completed_date: today
          }])
          .select()
          .single();

        if (error) throw error;
        setCompletions(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      setHabits(prev => prev.filter(h => h.id !== habitId));
      
      toast({
        title: "Success!",
        description: "Habit deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    }
  };

  const isHabitCompleted = (habitId: string) => {
    return completions.some(c => c.habit_id === habitId);
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">💪 Daily Habits</h3>
              <p className="text-sm text-white/70">Build consistent routines</p>
            </div>
          </div>
          <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Habit name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Input
                  placeholder="Category"
                  value={newHabit.category}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Input
                  placeholder="Emoji/Icon"
                  value={newHabit.icon}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Button onClick={addHabit} className="w-full bg-purple-600 hover:bg-purple-700">
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => {
            const completed = isHabitCompleted(habit.id);
            return (
              <div
                key={habit.id}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  completed
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{habit.icon}</div>
                    <div>
                      <h4 className={`font-semibold ${completed ? 'text-green-300 line-through' : 'text-white'}`}>
                        {habit.name}
                      </h4>
                      <p className="text-sm text-white/60">
                        {habit.category} • Streak: {habit.current_streak}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleHabit(habit.id)}
                      className={completed ? 'text-green-400' : 'text-white hover:text-green-400'}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {habits.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <p>No habits yet. Add your first habit to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
