import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useGuestMode } from './useGuestMode';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'study' | 'gym' | 'personal' | 'college';
  created_date: string;
  user_id: string;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dsaCount, setDsaCount] = useState({ today: 0, week: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  // Guest mode data initialization
  useEffect(() => {
    if (isGuestMode) {
      setTodos(guestData.todos);
      setNotes(guestData.notes);
      setDsaCount({
        today: guestData.dsaProblems.filter(p => p.solved_date === new Date().toISOString().split('T')[0]).length,
        week: guestData.dsaProblems.length,
        streak: 5
      });
      setLoading(false);
    }
  }, [isGuestMode, guestData]);

  // Calculate DSA streak
  const calculateDSAStreak = async (userId: string) => {
    try {
      const { data: problems, error } = await supabase
        .from('dsa_problems')
        .select('solved_date')
        .eq('user_id', userId)
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

  // Fetch data from Supabase
  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch todos
      const today = new Date().toISOString().split('T')[0];
      const { data: todosData, error: todosError } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (todosError) throw todosError;
      
      const typedTodos: Todo[] = (todosData || []).map(todo => ({
        ...todo,
        priority: todo.priority as 'high' | 'medium' | 'low',
        category: todo.category as 'study' | 'gym' | 'personal' | 'college'
      }));
      setTodos(typedTodos);

      // Fetch notes (recent 5)
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notesError) throw notesError;
      setNotes(notesData || []);

      // Fetch DSA data
      const { data: todayDSA, error: todayError } = await supabase
        .from('dsa_problems')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today)
        .lt('created_at', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);

      if (todayError) throw todayError;

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const { data: weekDSA, error: weekError } = await supabase
        .from('dsa_problems')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString().split('T')[0]);

      if (weekError) throw weekError;

      const streak = await calculateDSAStreak(user.id);

      setDsaCount({
        today: todayDSA?.length || 0,
        week: weekDSA?.length || 0,
        streak
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add todo
  const addTodo = async (text: string, priority: Todo['priority'], category: Todo['category']) => {
    if (isGuestMode) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text,
        priority,
        category,
        completed: false,
        created_date: new Date().toISOString().split('T')[0],
        user_id: 'guest'
      };
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    }

    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          text,
          priority,
          category,
          user_id: user.id,
          completed: false,
        }])
        .select()
        .single();

      if (error) throw error;
      const typedTodo: Todo = {
        ...data,
        priority: data.priority as 'high' | 'medium' | 'low',
        category: data.category as 'study' | 'gym' | 'personal' | 'college'
      };
      setTodos(prev => [typedTodo, ...prev]);
      return typedTodo;
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  // Toggle todo
  const toggleTodo = async (id: string) => {
    if (isGuestMode) {
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
      return;
    }

    if (!user) return;

    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  // Add note
  const addNote = async (content: string) => {
    if (isGuestMode) {
      const newNote: Note = {
        id: Date.now().toString(),
        content,
        created_at: new Date().toISOString(),
        user_id: 'guest'
      };
      setNotes(prev => [newNote, ...prev.slice(0, 4)]);
      return newNote;
    }

    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          content,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data, ...prev.slice(0, 4)]);
      await fetchData(); // Refresh data
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  // Add DSA problem
  const addDSAProblem = async () => {
    if (isGuestMode) {
      setDsaCount(prev => ({
        ...prev,
        today: prev.today + 1,
        week: prev.week + 1
      }));
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase
        .from('dsa_problems')
        .insert([{
          problem_name: `Problem ${dsaCount.today + 1}`,
          user_id: user.id,
        }]);

      if (error) throw error;
      await fetchData(); // Refresh data to get updated counts
    } catch (error) {
      console.error('Error adding DSA problem:', error);
      toast({
        title: "Error",
        description: "Failed to add DSA problem",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channels = [
      supabase.channel('todos-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`
        }, () => fetchData())
        .subscribe(),

      supabase.channel('dsa-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'dsa_problems',
          filter: `user_id=eq.${user.id}`
        }, () => fetchData())
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user]);

  useEffect(() => {
    if (user && !isGuestMode) {
      fetchData();
    }
  }, [user, isGuestMode]);

  return {
    todos,
    notes,
    dsaCount,
    loading,
    addTodo,
    toggleTodo,
    addNote,
    addDSAProblem,
    refetch: fetchData,
  };
};
