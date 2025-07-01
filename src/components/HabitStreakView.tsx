import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  bestStreak: number;
  completed: boolean;
}

interface HabitDay {
  date: string;
  completed: boolean;
}

const HabitStreakView = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Prayer', emoji: '🙏', streak: 0, bestStreak: 0, completed: false },
    { id: '2', name: 'Gym Workout', emoji: '🏋️', streak: 0, bestStreak: 0, completed: false },
    { id: '3', name: 'DSA Problem', emoji: '💻', streak: 0, bestStreak: 0, completed: false },
    { id: '4', name: '7+ Hours Sleep', emoji: '😴', streak: 0, bestStreak: 0, completed: false },
    { id: '5', name: 'Protein Intake', emoji: '🥛', streak: 0, bestStreak: 0, completed: false },
  ]);

  const [habitHistory, setHabitHistory] = useState<Record<string, HabitDay[]>>({});
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', emoji: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Generate last 100 days for GitHub-style view
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 99; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = generateDates();

  // Calculate real streak from history
  const calculateRealStreak = (habitId: string): { current: number; best: number } => {
    const history = habitHistory[habitId] || [];
    if (history.length === 0) return { current: 0, best: 0 };

    // Sort by date descending
    const sortedHistory = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current streak (from today backwards)
    const today = new Date().toISOString().split('T')[0];
    let dateToCheck = new Date();
    
    while (true) {
      const dateStr = dateToCheck.toISOString().split('T')[0];
      const dayRecord = history.find(day => day.date === dateStr);
      
      if (dayRecord?.completed) {
        currentStreak++;
        dateToCheck.setDate(dateToCheck.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate best streak from entire history
    for (const day of sortedHistory) {
      if (day.completed) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    return { current: currentStreak, best: Math.max(bestStreak, currentStreak) };
  };

  // Load habits and history from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits-editable');
    const savedHistory = localStorage.getItem('habit-history');
    const lastUpdate = localStorage.getItem('habits-last-update');
    const today = new Date().toDateString();
    
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      
      // Reset completion status if it's a new day
      if (lastUpdate !== today) {
        const resetHabits = parsedHabits.map((habit: Habit) => ({
          ...habit,
          completed: false
        }));
        setHabits(resetHabits);
        localStorage.setItem('habits-last-update', today);
      } else {
        setHabits(parsedHabits);
      }
    }

    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setHabitHistory(history);
      
      // Update streaks based on real data
      setHabits(prev => prev.map(habit => {
        const realStreaks = calculateRealStreak(habit.id);
        return {
          ...habit,
          streak: realStreaks.current,
          bestStreak: realStreaks.best
        };
      }));
    }
  }, []);

  // Update streaks whenever history changes
  useEffect(() => {
    setHabits(prev => prev.map(habit => {
      const realStreaks = calculateRealStreak(habit.id);
      return {
        ...habit,
        streak: realStreaks.current,
        bestStreak: realStreaks.best
      };
    }));
  }, [habitHistory]);

  // Save habits and history to localStorage
  useEffect(() => {
    localStorage.setItem('habits-editable', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habit-history', JSON.stringify(habitHistory));
  }, [habitHistory]);

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed;
        
        // Update history
        setHabitHistory(prev => ({
          ...prev,
          [id]: [
            ...(prev[id] || []).filter(day => day.date !== today),
            { date: today, completed: newCompleted }
          ]
        }));
        
        return {
          ...habit,
          completed: newCompleted
        };
      }
      return habit;
    }));
  };

  const getHabitCompletionForDate = (habitId: string, date: string): boolean => {
    const habitDays = habitHistory[habitId] || [];
    const dayRecord = habitDays.find(day => day.date === date);
    return dayRecord?.completed || false;
  };

  const getIntensityColor = (completed: boolean, date: string): string => {
    if (!completed) return 'bg-gray-800 border-gray-700';
    
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;
    const isRecent = new Date(date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    if (isToday) return 'bg-green-400 border-green-300';
    if (isRecent) return 'bg-green-500 border-green-400';
    return 'bg-green-600 border-green-500';
  };

  const startEditHabit = (habit: Habit) => {
    setEditingHabit(habit.id);
    setEditForm({ name: habit.name, emoji: habit.emoji });
  };

  const saveHabitEdit = () => {
    if (!editingHabit) return;
    
    setHabits(prev => prev.map(habit => 
      habit.id === editingHabit 
        ? { ...habit, ...editForm }
        : habit
    ));
    setEditingHabit(null);
    setEditForm({ name: '', emoji: '' });
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    setHabitHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[id];
      return newHistory;
    });
  };

  const addNewHabit = () => {
    if (!editForm.name) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: editForm.name,
      emoji: editForm.emoji || '⭐',
      streak: 0,
      bestStreak: 0,
      completed: false
    };
    
    setHabits(prev => [...prev, newHabit]);
    setEditForm({ name: '', emoji: '' });
    setShowAddForm(false);
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold gradient-text">Daily Habits</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {completedCount}/{habits.length} completed today ({completionRate}%)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
          </button>
          <div className="text-2xl sm:text-3xl animate-pulse-slow">🔥</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Add New Habit Form */}
      {showAddForm && (
        <div className="mb-6 p-3 sm:p-4 bg-secondary/50 rounded-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Emoji"
              value={editForm.emoji}
              onChange={(e) => setEditForm(prev => ({ ...prev, emoji: e.target.value }))}
              className="px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
            />
            <input
              type="text"
              placeholder="Habit name"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 bg-background border border-border rounded text-foreground col-span-1 sm:col-span-3 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addNewHabit}
              className="px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
            >
              <Save size={14} />
              Add Habit
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 sm:px-4 py-2 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Habits List with GitHub-style Streaks */}
      <div className="space-y-4 sm:space-y-6">
        {habits.map((habit) => {
          const isEditing = editingHabit === habit.id;
          
          return (
            <div key={habit.id} className="space-y-3">
              {/* Habit Header */}
              <div className={`p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                habit.completed
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-secondary/50 border-border hover:bg-secondary/70'
              }`}>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        value={editForm.emoji}
                        onChange={(e) => setEditForm(prev => ({ ...prev, emoji: e.target.value }))}
                        className="px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                      />
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 bg-background border border-border rounded text-foreground col-span-1 sm:col-span-3 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveHabitEdit}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Save size={12} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingHabit(null)}
                        className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors flex items-center gap-1 text-sm"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1" onClick={() => toggleHabit(habit.id)}>
                      <div className="text-xl sm:text-2xl">{habit.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm sm:text-base truncate ${habit.completed ? 'text-primary' : 'text-foreground'}`}>
                          {habit.name}
                        </h3>
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
                          <span>Current: {habit.streak} days</span>
                          <span>Best: {habit.bestStreak} days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {habit.completed && (
                        <div className="text-primary font-medium text-xs sm:text-sm hidden sm:block">✓ Done</div>
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditHabit(habit)}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        habit.completed
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {habit.completed && (
                          <div className="w-full h-full rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GitHub-style Contribution Graph */}
              {!isEditing && (
                <div className="ml-2 sm:ml-4">
                  <div className="text-xs text-muted-foreground mb-2">Last 100 days</div>
                  <div className="grid grid-cols-20 sm:grid-cols-25 lg:grid-cols-20 gap-0.5 sm:gap-1">
                    {dates.map((date) => {
                      const completed = getHabitCompletionForDate(habit.id, date);
                      return (
                        <div
                          key={date}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm border ${getIntensityColor(completed, date)}`}
                          title={`${date}: ${completed ? 'Completed' : 'Not completed'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-3 sm:p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
        <p className="text-xs sm:text-sm text-orange-400 font-medium">
          🔥 Build streaks to become unstoppable. Small daily wins create massive results.
        </p>
      </div>
    </div>
  );
};

export default HabitStreakView;
