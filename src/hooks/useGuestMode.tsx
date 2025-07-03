import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getLocalDateString } from '@/lib/timeUtils';

interface GuestModeContextType {
  isGuestMode: boolean;
  setGuestMode: (enabled: boolean) => void;
  guestData: GuestData;
}

interface GuestTodo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'study' | 'gym' | 'personal' | 'college';
  created_date: string;
}

interface GuestHabit {
  id: string;
  name: string;
  category: string;
  color: string;
  current_streak: number;
  best_streak: number;
  target_frequency: number;
  icon: string;
}

interface GuestHabitCompletion {
  id: string;
  habit_id: string;
  completed: boolean;
  date: string;
}

interface GuestNote {
  id: string;
  content: string;
  created_date: string;
}

interface GuestDSAProblem {
  id: string;
  problem_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  solved_date: string;
}

interface GuestGymCheckin {
  id: string;
  checkin_date: string;
  checkin_time: string;
}

interface GuestDailyBlock {
  id: string;
  time_slot: string;
  task: string;
  emoji: string;
  block_type: string;
  completed: boolean;
  date: string;
  is_active: boolean;
}

interface GuestFocusSession {
  id: string;
  session_type: string;
  duration_minutes: number;
  completed: boolean;
  created_at: string;
}

interface GuestData {
  todos: GuestTodo[];
  archivedTodos: GuestTodo[];
  habits: GuestHabit[];
  habitCompletions: GuestHabitCompletion[];
  notes: GuestNote[];
  dsaProblems: GuestDSAProblem[];
  gymCheckins: GuestGymCheckin[];
  dailyBlocks: GuestDailyBlock[];
  focusSessions: GuestFocusSession[];
}

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

export const GuestModeProvider = ({ children }: { children: ReactNode }) => {
  const [isGuestMode, setIsGuestMode] = useState(false);

  const guestData: GuestData = {
    todos: [
      { id: '1', text: 'Complete TUF DSA arrays section', completed: true, priority: 'high', category: 'study', created_date: getLocalDateString() },
      { id: '2', text: 'Gym workout - Push day', completed: true, priority: 'medium', category: 'gym', created_date: getLocalDateString() },
      { id: '3', text: 'Review system design concepts', completed: true, priority: 'high', category: 'study', created_date: getLocalDateString() },
      { id: '4', text: 'Update resume with latest projects', completed: false, priority: 'medium', category: 'personal', created_date: getLocalDateString() },
      { id: '5', text: 'Practice LeetCode medium problems', completed: false, priority: 'high', category: 'study', created_date: getLocalDateString() },
      { id: '6', text: 'Plan weekend schedule', completed: false, priority: 'low', category: 'personal', created_date: getLocalDateString() },
      { id: '7', text: 'Read about new React features', completed: false, priority: 'medium', category: 'study', created_date: getLocalDateString() },
      { id: '8', text: 'Prepare for tomorrow meetings', completed: false, priority: 'high', category: 'college', created_date: getLocalDateString() },
    ],
    archivedTodos: [],
    habits: [
      { id: '1', name: 'Morning Exercise', category: 'fitness', color: '#22C55E', current_streak: 7, best_streak: 15, target_frequency: 1, icon: '🏃' },
      { id: '2', name: 'Daily Reading', category: 'learning', color: '#3B82F6', current_streak: 12, best_streak: 20, target_frequency: 1, icon: '📚' },
      { id: '3', name: 'Meditation', category: 'wellness', color: '#8B5CF6', current_streak: 5, best_streak: 10, target_frequency: 1, icon: '🧘' },
      { id: '4', name: 'Coding Practice', category: 'learning', color: '#F59E0B', current_streak: 9, best_streak: 14, target_frequency: 1, icon: '💻' },
    ],
    habitCompletions: [
      { id: '1', habit_id: '1', completed: true, date: getLocalDateString() },
      { id: '2', habit_id: '2', completed: true, date: getLocalDateString() },
      { id: '3', habit_id: '3', completed: false, date: getLocalDateString() },
      { id: '4', habit_id: '4', completed: true, date: getLocalDateString() },
    ],
    notes: [
      { id: '1', content: 'Need to focus on dynamic programming problems this week. Arrays and strings are getting better!', created_date: getLocalDateString() },
      { id: '2', content: 'Great workout today - increased weights on bench press. Recovery feeling good.', created_date: getLocalDateString() },
      { id: '3', content: 'System design interview prep: Focus on scalability patterns and database sharding.', created_date: getLocalDateString() },
      { id: '4', content: 'React 18 concurrent features look promising for performance optimization.', created_date: getLocalDateString() },
      { id: '5', content: 'Weekly goals: 5 DSA problems, 3 gym sessions, 1 project deployment.', created_date: getLocalDateString() },
    ],
    dsaProblems: [
      { id: '1', problem_name: 'Two Sum', difficulty: 'easy', topic: 'Arrays', solved_date: getLocalDateString() },
      { id: '2', problem_name: 'Binary Tree Inorder', difficulty: 'medium', topic: 'Trees', solved_date: getLocalDateString() },
      { id: '3', problem_name: 'Merge Intervals', difficulty: 'medium', topic: 'Arrays', solved_date: getLocalDateString(new Date(Date.now() - 86400000)) },
    ],
    gymCheckins: [
      { id: '1', checkin_date: getLocalDateString(), checkin_time: '06:30' },
      { id: '2', checkin_date: getLocalDateString(new Date(Date.now() - 86400000)), checkin_time: '07:00' },
    ],
    dailyBlocks: [
      { id: '1', time_slot: '06:00-06:15', task: 'Wake + Water + Prayer', emoji: '🌅', block_type: 'routine', completed: true, date: getLocalDateString(), is_active: false },
      { id: '2', time_slot: '06:15-07:15', task: 'Gym Workout', emoji: '🏋️', block_type: 'gym', completed: true, date: getLocalDateString(), is_active: false },
      { id: '3', time_slot: '07:15-07:45', task: 'Breakfast + Protein', emoji: '🥣', block_type: 'routine', completed: true, date: getLocalDateString(), is_active: false },
      { id: '4', time_slot: '08:30-16:30', task: 'College/Work', emoji: '🎓', block_type: 'college', completed: false, date: getLocalDateString(), is_active: true },
      { id: '5', time_slot: '17:00-17:30', task: 'Nap/Reset', emoji: '😴', block_type: 'break', completed: false, date: getLocalDateString(), is_active: false },
      { id: '6', time_slot: '17:30-18:15', task: 'DSA Practice', emoji: '💻', block_type: 'study', completed: false, date: getLocalDateString(), is_active: false },
      { id: '7', time_slot: '18:15-19:15', task: 'Project Development', emoji: '🚀', block_type: 'study', completed: false, date: getLocalDateString(), is_active: false },
      { id: '8', time_slot: '19:15-19:45', task: 'Dinner', emoji: '🍽️', block_type: 'routine', completed: false, date: getLocalDateString(), is_active: false },
    ],
    focusSessions: [
      { id: '1', session_type: 'study', duration_minutes: 25, completed: true, created_at: new Date().toISOString() },
      { id: '2', session_type: 'dsa', duration_minutes: 45, completed: true, created_at: new Date().toISOString() },
      { id: '3', session_type: 'dev', duration_minutes: 60, completed: true, created_at: new Date(Date.now() - 3600000).toISOString() },
    ]
  };

  const setGuestMode = (enabled: boolean) => {
    setIsGuestMode(enabled);
    if (enabled) {
      localStorage.setItem('guestMode', 'true');
    } else {
      localStorage.removeItem('guestMode');
    }
  };

  useEffect(() => {
    const savedGuestMode = localStorage.getItem('guestMode') === 'true';
    if (savedGuestMode) {
      setIsGuestMode(true);
    }
  }, []);

  return (
    <GuestModeContext.Provider value={{ isGuestMode, setGuestMode, guestData }}>
      {children}
    </GuestModeContext.Provider>
  );
};

export const useGuestMode = () => {
  const context = useContext(GuestModeContext);
  if (context === undefined) {
    throw new Error('useGuestMode must be used within a GuestModeProvider');
  }
  return context;
}; 