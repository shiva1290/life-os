import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useGuestMode } from './useGuestMode';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { parseTimeSlot, getCurrentTimeInMinutes, isTimeInRange } from '@/utils/timeHelpers';
import { getLocalDateString } from '@/lib/timeUtils';

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
  content: Record<string, unknown>;
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
  const { isGuestMode, guestData } = useGuestMode();
  const { toast } = useToast();
  const [dailyBlocks, setDailyBlocks] = useState<DailyBlock[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Guest mode data initialization
  useEffect(() => {
    if (isGuestMode) {
      setDailyBlocks(guestData.dailyBlocks.map(block => ({
        ...block,
        is_active: false,
        user_id: 'guest'
      })));
      setFocusSessions(guestData.focusSessions.map(session => ({
        ...session,
        user_id: 'guest'
      })));
      setReflections([]);
      setProjectTasks([]);
      setLoading(false);
    }
  }, [isGuestMode, guestData]);

  // Fetch all data
  const fetchData = async () => {
    if (!user || isGuestMode) return;

    try {
      const today = getLocalDateString();

      // Fetch daily blocks for current user and today
      const { data: blocksData, error: blocksError } = await supabase
        .from('daily_blocks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('time_slot');

      if (blocksError) throw blocksError;
      setDailyBlocks(blocksData || []);

      // Fetch focus sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setFocusSessions(sessionsData || []);

      // Fetch reflections
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (reflectionsError) throw reflectionsError;
      setReflections(reflectionsData || []);

      // Fetch project tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('user_id', user.id)
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
    if (isGuestMode) {
      const newBlock: DailyBlock = {
        ...block,
        id: Date.now().toString(),
        user_id: 'guest'
      };
      setDailyBlocks(prev => [...prev, newBlock].sort((a, b) => a.time_slot.localeCompare(b.time_slot)));
      toast({
        title: "Success",
        description: "Daily block added successfully",
      });
      return newBlock;
    }

    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_blocks')
        .insert([{ ...block, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setDailyBlocks(prev => [...prev, data].sort((a, b) => a.time_slot.localeCompare(b.time_slot)));
      
      toast({
        title: "Success",
        description: "Daily block added successfully",
      });
      
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
    if (isGuestMode) {
      setDailyBlocks(prev => prev.map(block => 
        block.id === id ? { ...block, ...updates } : block
      ));
      toast({
        title: "Success",
        description: "Block updated successfully",
      });
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_blocks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setDailyBlocks(prev => prev.map(block => 
        block.id === id ? { ...block, ...updates } : block
      ));
      
      toast({
        title: "Success",
        description: "Block updated successfully",
      });
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
    if (isGuestMode) {
      setDailyBlocks(prev => prev.filter(block => block.id !== id));
      toast({
        title: "Success",
        description: "Block deleted successfully",
      });
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_blocks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setDailyBlocks(prev => prev.filter(block => block.id !== id));
      
      toast({
        title: "Success",
        description: "Block deleted successfully",
      });
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
        .eq('id', id)
        .eq('user_id', user.id);

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

  // Get current active block with improved time parsing
  const getCurrentBlock = useCallback(() => {
    const currentTimeMinutes = getCurrentTimeInMinutes();
    return dailyBlocks.find((block: DailyBlock) => {
      const timeSlot = parseTimeSlot(block.time_slot);
      if (!timeSlot) return false;
      return currentTimeMinutes >= timeSlot.start && currentTimeMinutes <= timeSlot.end;
    }) || null;
  }, [dailyBlocks]);

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
        date: getLocalDateString()
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user || isGuestMode) return;

    const channels = [
      supabase.channel('daily-blocks-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'daily_blocks',
          filter: `user_id=eq.${user.id}`
        }, () => fetchData())
        .subscribe(),

      supabase.channel('focus-sessions-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'focus_sessions',
          filter: `user_id=eq.${user.id}`
        }, () => fetchData())
        .subscribe(),

      supabase.channel('project-tasks-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `user_id=eq.${user.id}`
        }, () => fetchData())
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, isGuestMode]);

  useEffect(() => {
    if (user && !isGuestMode) {
      fetchData();
    }
  }, [user, isGuestMode]);

  // Removed auto-initialization to prevent data being repopulated after deletion
  // useEffect(() => {
  //   if (user && !loading && dailyBlocks.length === 0) {
  //     initializeDefaultBlocks();
  //   }
  // }, [user, loading, dailyBlocks.length]);

  const broadcastUpdate = (data: Record<string, unknown>) => {
    window.dispatchEvent(new CustomEvent('operatorUpdate', { detail: data }));
  };

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
