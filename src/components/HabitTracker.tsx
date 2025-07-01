
import React, { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  bestStreak: number;
  completed: boolean;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Prayer', emoji: '🙏', streak: 0, bestStreak: 0, completed: false },
    { id: '2', name: 'Gym Workout', emoji: '🏋️', streak: 0, bestStreak: 0, completed: false },
    { id: '3', name: 'DSA Problem', emoji: '💻', streak: 0, bestStreak: 0, completed: false },
    { id: '4', name: '7+ Hours Sleep', emoji: '😴', streak: 0, bestStreak: 0, completed: false },
    { id: '5', name: 'Protein Intake', emoji: '🥛', streak: 0, bestStreak: 0, completed: false },
  ]);

  // Load habits from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('habits');
    const lastUpdate = localStorage.getItem('habits-last-update');
    
    if (saved) {
      const parsedHabits = JSON.parse(saved);
      
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
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed;
        const newStreak = newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        const newBestStreak = Math.max(habit.bestStreak, newStreak);
        
        return {
          ...habit,
          completed: newCompleted,
          streak: newStreak,
          bestStreak: newBestStreak
        };
      }
      return habit;
    }));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Daily Habits</h2>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{habits.length} completed today ({completionRate}%)
          </p>
        </div>
        <div className="text-3xl animate-pulse-slow">🔥</div>
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

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              habit.completed
                ? 'bg-primary/10 border-primary/30'
                : 'bg-secondary/50 border-border hover:bg-secondary/70'
            }`}
            onClick={() => toggleHabit(habit.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{habit.emoji}</div>
                <div>
                  <h3 className={`font-semibold ${habit.completed ? 'text-primary' : 'text-foreground'}`}>
                    {habit.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Current: {habit.streak} days</span>
                    <span>Best: {habit.bestStreak} days</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {habit.completed && (
                  <div className="text-primary font-medium text-sm">✓ Done</div>
                )}
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
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
        <p className="text-sm text-orange-400 font-medium">
          🔥 Build streaks to become unstoppable. Small daily wins create massive results.
        </p>
      </div>
    </div>
  );
};

export default HabitTracker;
