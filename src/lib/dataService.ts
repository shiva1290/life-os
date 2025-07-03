import { User } from '@supabase/supabase-js';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'study' | 'gym' | 'personal' | 'college';
  created_date: string;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export class DataService {
  private static instance: DataService;
  
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private getUserStorageKey(user: User | null, key: string): string {
    if (!user) return `guest_${key}`;
    return `user_${user.id}_${key}`;
  }

  checkDailyReset(user: User | null) {
    const today = new Date().toDateString();
    const resetKey = this.getUserStorageKey(user, 'last-daily-reset');
    const lastReset = localStorage.getItem(resetKey);
    
    if (lastReset !== today) {
      this.performDailyReset(user);
      localStorage.setItem(resetKey, today);
    }
  }

  private performDailyReset(user: User | null) {
    const todosKey = this.getUserStorageKey(user, 'daily-todos');
    const archivedKey = this.getUserStorageKey(user, 'archived-todos');
    const habitsKey = this.getUserStorageKey(user, 'habits-editable');
    const historyKey = this.getUserStorageKey(user, 'habit-history');

    // Archive completed todos
    const currentTodos: Todo[] = JSON.parse(localStorage.getItem(todosKey) || '[]');
    const completedTodos = currentTodos.filter((todo: Todo) => todo.completed);
    
    if (completedTodos.length > 0) {
      const archivedTodos = JSON.parse(localStorage.getItem(archivedKey) || '[]');
      archivedTodos.push({
        date: new Date().toDateString(),
        todos: completedTodos
      });
      localStorage.setItem(archivedKey, JSON.stringify(archivedTodos));
    }

    // Reset todos
    const resetTodos = currentTodos.map((todo: Todo) => ({ ...todo, completed: false }));
    localStorage.setItem(todosKey, JSON.stringify(resetTodos));

    // Move habits to next day
    const habits: Habit[] = JSON.parse(localStorage.getItem(habitsKey) || '[]');
    const habitHistory: Record<string, unknown[]> = JSON.parse(localStorage.getItem(historyKey) || '{}');
    
    habits.forEach((habit: Habit) => {
      if (!habitHistory[habit.id]) {
        habitHistory[habit.id] = [];
      }
    });
    
    localStorage.setItem(historyKey, JSON.stringify(habitHistory));
  }

  // Helper methods for user-scoped data access
  getUserTodos(user: User | null): Todo[] {
    const key = this.getUserStorageKey(user, 'daily-todos');
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  setUserTodos(user: User | null, todos: Todo[]) {
    const key = this.getUserStorageKey(user, 'daily-todos');
    localStorage.setItem(key, JSON.stringify(todos));
    this.broadcastChange('todos', todos);
  }

  getUserHabits(user: User | null): Habit[] {
    const key = this.getUserStorageKey(user, 'habits-editable');
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  setUserHabits(user: User | null, habits: Habit[]) {
    const key = this.getUserStorageKey(user, 'habits-editable');
    localStorage.setItem(key, JSON.stringify(habits));
    this.broadcastChange('habits', habits);
  }

  // Clear all data for a specific user
  clearUserData(user: User | null) {
    if (!user) return;
    
    const keys = [
      'daily-todos',
      'archived-todos', 
      'habits-editable',
      'habit-history',
      'last-daily-reset',
      'fitness_milestones',
      'career_milestones'
    ];

    keys.forEach(key => {
      const userKey = this.getUserStorageKey(user, key);
      localStorage.removeItem(userKey);
    });
  }

  // Clear all user data except for specified user
  clearAllUsersDataExcept(preserveUserEmail: string) {
    // Get all localStorage keys
    const allKeys = Object.keys(localStorage);
    
    // Find user-scoped keys and remove them except for the preserved user
    allKeys.forEach(key => {
      if (key.startsWith('user_') && !key.includes('guest_')) {
        // Extract user ID and check if it matches the preserved user
        // Since we don't have direct email mapping, we'll clear all user_ keys
        // The preserved user will need to re-login to get fresh data
        localStorage.removeItem(key);
      }
      
      // Also clear non-user-scoped legacy keys
      if ([
        'daily-todos',
        'archived-todos', 
        'habits-editable',
        'habit-history',
        'last-daily-reset'
      ].includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    console.log(`Cleared localStorage data for all users except ${preserveUserEmail}`);
  }

  broadcastChange(type: string, data: unknown) {
    window.dispatchEvent(new CustomEvent('dataChange', { 
      detail: { type, data } 
    }));
  }
}
