
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface DailyBlock {
  id: string;
  time_slot: string;
  task: string;
  emoji: string;
  block_type: string;
  is_active: boolean;
  completed: boolean;
  date: string;
  user_id: string;
}

interface FocusSession {
  id: string;
  session_type: string;
  duration_minutes: number;
  completed: boolean;
  notes?: string;
  created_at: string;
  user_id: string;
}

interface Reflection {
  id: string;
  reflection_type: string;
  date: string;
  content: any;
  mood_score: number;
  user_id: string;
}

interface ProjectTask {
  id: string;
  project_name: string;
  task_title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  user_id: string;
}

export const useOperatorSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyBlocks, setDailyBlocks] = useState<DailyBlock[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch daily blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('daily_blocks')
        .select('*')
        .eq('date', today)
        .order('time_slot');

      if (blocksError) throw blocksError;
      setDailyBlocks(blocksData || []);

      // Fetch focus sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('focus_sessions')
        .select('*')
        .gte('created_at', today)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setFocusSessions(sessionsData || []);

      // Fetch reflections
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from('reflections')
        .select('*')
        .eq('date', today);

      if (reflectionsError) throw reflectionsError;
      setReflections(reflectionsData || []);

      // Fetch project tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('project_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      setProjectTasks(tasksData || []);

    } catch (error) {
      console.error('Error fetching operator data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync operator data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Daily Blocks CRUD
  const addDailyBlock = async (block: Omit<DailyBlock, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_blocks')
        .insert([{ ...block, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setDailyBlocks(prev => [...prev, data].sort((a, b) => a.time_slot.localeCompare(b.time_slot)));
      return data;
    } catch (error) {
      console.error('Error adding daily block:', error);
      toast({
        title: "Error",
        description: "Failed to add daily block",
        variant: "destructive",
      });
    }
  };

  const updateDailyBlock = async (id: string, updates: Partial<DailyBlock>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_blocks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setDailyBlocks(prev => prev.map(block => 
        block.id === id ? { ...block, ...updates } : block
      ));
    } catch (error) {
      console.error('Error updating daily block:', error);
      toast({
        title: "Error",
        description: "Failed to update daily block",
        variant: "destructive",
      });
    }
  };

  const deleteDailyBlock = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDailyBlocks(prev => prev.filter(block => block.id !== id));
    } catch (error) {
      console.error('Error deleting daily block:', error);
      toast({
        title: "Error",
        description: "Failed to delete daily block",
        variant: "destructive",
      });
    }
  };

  // Focus Sessions CRUD
  const addFocusSession = async (session: Omit<FocusSession, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .insert([{ ...session, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setFocusSessions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding focus session:', error);
      toast({
        title: "Error",
        description: "Failed to add focus session",
        variant: "destructive",
      });
    }
  };

  // Project Tasks CRUD
  const addProjectTask = async (task: Omit<ProjectTask, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert([{ ...task, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setProjectTasks(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding project task:', error);
      toast({
        title: "Error",
        description: "Failed to add project task",
        variant: "destructive",
      });
    }
  };

  const updateProjectTask = async (id: string, updates: Partial<ProjectTask>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('project_tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setProjectTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (error) {
      console.error('Error updating project task:', error);
      toast({
        title: "Error",
        description: "Failed to update project task",
        variant: "destructive",
      });
    }
  };

  // Reflections CRUD
  const addReflection = async (reflection: Omit<Reflection, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reflections')
        .insert([{ ...reflection, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setReflections(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding reflection:', error);
      toast({
        title: "Error",
        description: "Failed to add reflection",
        variant: "destructive",
      });
    }
  };

  // Get current active block
  const getCurrentBlock = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    return dailyBlocks.find(block => {
      const [startHour, startMin] = block.time_slot.split('-')[0].split(':').map(Number);
      const [endHour, endMin] = block.time_slot.split('-')[1]?.split(':').map(Number) || [startHour + 1, startMin];
      
      const blockStart = startHour * 60 + startMin;
      const blockEnd = endHour * 60 + endMin;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      return currentMinutes >= blockStart && currentMinutes < blockEnd;
    });
  };

  // Initialize default daily blocks for new users
  const initializeDefaultBlocks = async () => {
    if (!user || dailyBlocks.length > 0) return;

    const defaultBlocks = [
      { time_slot: '06:00-06:15', task: 'Wake + Water + Prayer', emoji: '🌅', block_type: 'routine' },
      { time_slot: '06:15-07:15', task: 'Gym', emoji: '🏋️', block_type: 'gym' },
      { time_slot: '07:15-07:45', task: 'Breakfast + Protein', emoji: '🥣', block_type: 'routine' },
      { time_slot: '08:30-16:30', task: 'College', emoji: '🎓', block_type: 'college' },
      { time_slot: '17:00-17:30', task: 'Nap/Reset', emoji: '😴', block_type: 'break' },
      { time_slot: '17:30-18:15', task: 'TUF DSA Concept', emoji: '📚', block_type: 'study' },
      { time_slot: '18:15-19:15', task: 'Striver Sheet (2-3 Qs)', emoji: '💻', block_type: 'study' },
      { time_slot: '19:15-19:45', task: 'Dinner', emoji: '🍽️', block_type: 'routine' },
      { time_slot: '20:00-21:00', task: 'DSA Revision OR Dev', emoji: '🔄', block_type: 'study' },
      { time_slot: '21:00-21:45', task: 'Wind Down', emoji: '📱', block_type: 'break' },
      { time_slot: '22:15-22:30', task: 'Prayer + Prep Next Day', emoji: '🙏', block_type: 'routine' },
    ];

    for (const block of defaultBlocks) {
      await addDailyBlock({
        ...block,
        is_active: false,
        completed: false,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user && !loading) {
      initializeDefaultBlocks();
    }
  }, [user, loading]);

  return {
    dailyBlocks,
    focusSessions,
    reflections,
    projectTasks,
    loading,
    addDailyBlock,
    updateDailyBlock,
    deleteDailyBlock,
    addFocusSession,
    addProjectTask,
    updateProjectTask,
    addReflection,
    getCurrentBlock,
    refetch: fetchData,
  };
};
