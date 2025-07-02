
import { supabase } from '@/integrations/supabase/client';

export const seedOperatorData = async (userId: string) => {
  // Clear existing data first
  await supabase.from('daily_blocks').delete().eq('user_id', userId);
  await supabase.from('habits').delete().eq('user_id', userId);
  await supabase.from('project_tasks').delete().eq('user_id', userId);
  
  const today = new Date().toISOString().split('T')[0];

  // Seed daily blocks (Shiva's schedule)
  const dailyBlocks = [
    { time_slot: '06:00-06:15', task: 'Wake + Water + Prayer', emoji: '🌅', block_type: 'routine' },
    { time_slot: '06:15-07:15', task: 'Gym', emoji: '🏋️', block_type: 'gym' },
    { time_slot: '07:15-07:45', task: 'Breakfast + Amul Protein', emoji: '🥣', block_type: 'routine' },
    { time_slot: '08:30-16:30', task: 'College', emoji: '🎓', block_type: 'college' },
    { time_slot: '17:00-17:30', task: 'Nap/Reset', emoji: '😴', block_type: 'break' },
    { time_slot: '17:30-18:15', task: 'TUF DSA Concept (video)', emoji: '📚', block_type: 'study' },
    { time_slot: '18:15-19:15', task: 'Striver Sheet (2–3 Qs)', emoji: '💻', block_type: 'study' },
    { time_slot: '19:15-19:45', task: 'Dinner', emoji: '🍽️', block_type: 'routine' },
    { time_slot: '20:00-21:00', task: 'DSA Revision OR Dev (light)', emoji: '🔄', block_type: 'study' },
    { time_slot: '21:00-21:45', task: 'Wind down: video or reflect', emoji: '📱', block_type: 'break' },
    { time_slot: '22:15-22:30', task: 'Prayer + prep for next day', emoji: '🙏', block_type: 'routine' },
  ];

  for (const block of dailyBlocks) {
    await supabase.from('daily_blocks').insert([{
      user_id: userId,
      date: today,
      ...block,
      is_active: false,
      completed: false
    }]);
  }

  // Seed core habits
  const habits = [
    { name: 'Morning Prayer', icon: '🙏', color: '#10B981', category: 'spiritual', target_frequency: 1 },
    { name: 'Gym Workout', icon: '🏋️', color: '#EF4444', category: 'fitness', target_frequency: 1 },
    { name: 'DSA Problems', icon: '💻', color: '#3B82F6', category: 'study', target_frequency: 3 },
    { name: 'Protein Intake', icon: '🥤', color: '#F59E0B', category: 'health', target_frequency: 1 },
    { name: 'Night Reflection', icon: '📝', color: '#8B5CF6', category: 'spiritual', target_frequency: 1 },
    { name: '7+ Hours Sleep', icon: '😴', color: '#6366F1', category: 'health', target_frequency: 1 },
  ];

  for (const habit of habits) {
    await supabase.from('habits').insert([{
      user_id: userId,
      ...habit,
      streak: 0,
      current_streak: 0,
      best_streak: 0
    }]);
  }

  // Seed project tasks
  const projectTasks = [
    {
      project_name: 'NoteAura',
      task_title: 'Setup basic MERN structure',
      description: 'Initialize React frontend with Node.js backend',
      status: 'todo',
      priority: 'high'
    },
    {
      project_name: 'NoteAura',
      task_title: 'Implement Markdown editor',
      description: 'Rich text editing with markdown support',
      status: 'todo',
      priority: 'high'
    },
    {
      project_name: 'NoteAura',
      task_title: 'PDF export functionality',
      description: 'Convert notes to PDF format',
      status: 'todo',
      priority: 'medium'
    },
    {
      project_name: 'Grey Shot',
      task_title: 'Anonymous posting system',
      description: 'Allow users to post anonymously',
      status: 'todo',
      priority: 'high'
    },
    {
      project_name: 'Grey Shot',
      task_title: 'AI comment moderation',
      description: 'Implement AI-based content filtering',
      status: 'todo',
      priority: 'medium'
    },
    {
      project_name: 'Resume',
      task_title: 'Update with latest projects',
      description: 'Add NoteAura and Grey Shot projects',
      status: 'todo',
      priority: 'high'
    }
  ];

  for (const task of projectTasks) {
    await supabase.from('project_tasks').insert([{
      user_id: userId,
      ...task
    }]);
  }

  // Seed some sample reflections
  await supabase.from('reflections').insert([{
    user_id: userId,
    reflection_type: 'daily',
    date: today,
    content: {
      wins: 'Started the operator system',
      improvements: 'Need to be more consistent with DSA',
      tomorrow: 'Focus on Striver Sheet problems'
    },
    mood_score: 8
  }]);
};
