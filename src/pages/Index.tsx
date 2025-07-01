
import React, { useState } from 'react';
import NowCard from '../components/NowCard';
import EditableGoalSection from '../components/EditableGoalSection';
import EditableSchedule from '../components/EditableSchedule';
import FitnessTimeline from '../components/FitnessTimeline';
import DailyTodos from '../components/DailyTodos';
import HabitStreakView from '../components/HabitStreakView';
import QuickNotes from '../components/QuickNotes';
import WeeklyProgress from '../components/WeeklyProgress';
import FocusTimer from '../components/FocusTimer';

// Default schedules
const defaultWeekdaySchedule = [
  { id: '1', time: '6:00', task: 'Wake + Water + Prayer', emoji: '🌅', type: 'routine' as const },
  { id: '2', time: '6:15', task: 'Gym Time - Push/Pull/Legs', emoji: '🏋️', type: 'gym' as const },
  { id: '3', time: '7:15', task: 'Breakfast + Protein', emoji: '🥣', type: 'routine' as const },
  { id: '4', time: '8:30', task: 'College', emoji: '🎓', type: 'college' as const },
  { id: '5', time: '16:30', task: 'College Ends', emoji: '🎓', type: 'college' as const },
  { id: '6', time: '17:00', task: 'Nap/Reset', emoji: '😴', type: 'break' as const },
  { id: '7', time: '17:30', task: 'TUF DSA Concept Video', emoji: '📚', type: 'study' as const },
  { id: '8', time: '18:15', task: 'Striver Sheet (2-3 Questions)', emoji: '💻', type: 'study' as const },
  { id: '9', time: '19:15', task: 'Dinner', emoji: '🍽️', type: 'routine' as const },
  { id: '10', time: '20:00', task: 'DSA Revision OR Dev (Light)', emoji: '⚡', type: 'study' as const },
  { id: '11', time: '21:00', task: 'Wind Down: Video or Reflect', emoji: '🧘', type: 'break' as const },
  { id: '12', time: '22:15', task: 'Prayer + Prep Next Day', emoji: '🙏', type: 'routine' as const },
  { id: '13', time: '22:30', task: 'Sleep', emoji: '😴', type: 'routine' as const },
];

const defaultSaturdaySchedule = [
  { id: 's1', time: '9:00', task: 'DSA Mock Contest', emoji: '⚔️', type: 'study' as const },
  { id: 's2', time: '10:00', task: 'Cohort 3.0 Project Build', emoji: '🛠️', type: 'study' as const },
  { id: 's3', time: '14:00', task: 'Push + Polish + Host', emoji: '🚀', type: 'study' as const },
  { id: 's4', time: '16:00', task: 'Rest/Social', emoji: '😊', type: 'break' as const },
  { id: 's5', time: '18:00', task: 'DSA Revise', emoji: '📖', type: 'study' as const },
  { id: 's6', time: '20:00', task: 'System Design Video', emoji: '🏗️', type: 'study' as const },
];

const defaultSundaySchedule = [
  { id: 'sun1', time: '9:00', task: 'Striver Sheet Weekly Review', emoji: '📊', type: 'study' as const },
  { id: 'sun2', time: '11:00', task: 'Resume/GitHub/LinkedIn Updates', emoji: '📝', type: 'study' as const },
  { id: 'sun3', time: '14:00', task: 'Read/Reflect', emoji: '📚', type: 'break' as const },
  { id: 'sun4', time: '17:00', task: 'Weekly Plan Reset', emoji: '🔄', type: 'routine' as const },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fitness' | 'productivity'>('dashboard');
  const [activeWeekendDay, setActiveWeekendDay] = useState<'saturday' | 'sunday'>('saturday');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-xl sm:text-2xl">⚡</div>
              <h1 className="text-lg sm:text-xl font-bold gradient-text">LifeOS Dashboard</h1>
            </div>
            
            <nav className="flex space-x-0.5 sm:space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('productivity')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'productivity'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                Productivity
              </button>
              <button
                onClick={() => setActiveTab('fitness')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'fitness'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                Fitness
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Current Task Card */}
            <NowCard />

            {/* Life Goals Section */}
            <EditableGoalSection />

            {/* Schedule Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <EditableSchedule 
                title="Daily Schedule (Mon-Fri)"
                scheduleKey="weekday"
                defaultSchedule={defaultWeekdaySchedule}
              />
              
              <div className="space-y-4">
                <div className="flex bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => setActiveWeekendDay('saturday')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-all ${
                      activeWeekendDay === 'saturday' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Saturday
                  </button>
                  <button
                    onClick={() => setActiveWeekendDay('sunday')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-all ${
                      activeWeekendDay === 'sunday' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sunday
                  </button>
                </div>
                
                {activeWeekendDay === 'saturday' ? (
                  <EditableSchedule 
                    title="Saturday Schedule"
                    scheduleKey="saturday"
                    defaultSchedule={defaultSaturdaySchedule}
                    isWeekend={true}
                  />
                ) : (
                  <EditableSchedule 
                    title="Sunday Schedule"
                    scheduleKey="sunday"
                    defaultSchedule={defaultSundaySchedule}
                    isWeekend={true}
                  />
                )}
              </div>
            </div>

            {/* Daily Affirmation */}
            <div className="glass-card p-6 sm:p-8 rounded-xl text-center">
              <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Daily Affirmation</h2>
              <blockquote className="text-sm sm:text-lg leading-relaxed space-y-2">
                <p className="italic text-foreground">
                  "I am a high-performing operator. I show up even when I'm tired."
                </p>
                <p className="italic text-foreground">
                  "I move with clarity. I pray, I push, I reflect."
                </p>
                <p className="italic text-primary font-semibold">
                  "My 12 LPA job already exists. I'm just catching up to it."
                </p>
              </blockquote>
            </div>
          </div>
        ) : activeTab === 'productivity' ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Focus Timer */}
            <FocusTimer />

            {/* Daily Tasks and Habits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <DailyTodos />
              <HabitStreakView />
            </div>

            {/* Quick Notes and Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <QuickNotes />
              <WeeklyProgress />
            </div>
          </div>
        ) : (
          <FitnessTimeline />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>LifeOS Dashboard • Stay focused, stay consistent, become unstoppable</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
