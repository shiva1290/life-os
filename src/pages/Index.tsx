import React, { useState } from 'react';
import NowCard from '../components/NowCard';
import EditableGoalSection from '../components/EditableGoalSection';
import EditableSchedule from '../components/EditableSchedule';
import FitnessTimeline from '../components/FitnessTimeline';
import CareerTimeline from '../components/CareerTimeline';
import DailyTodos from '../components/DailyTodos';
import HabitStreakView from '../components/HabitStreakView';
import QuickNotes from '../components/QuickNotes';
import WeeklyProgress from '../components/WeeklyProgress';
import FocusTimer from '../components/FocusTimer';
import DSATracker from '../components/DSATracker';
import GymCheckIn from '../components/GymCheckIn';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fitness' | 'career' | 'productivity'>('dashboard');
  const [activeWeekendDay, setActiveWeekendDay] = useState<'saturday' | 'sunday'>('saturday');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚡</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">LifeOS Dashboard</h1>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all backdrop-blur-sm ${
                  activeTab === 'dashboard'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('productivity')}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all backdrop-blur-sm ${
                  activeTab === 'productivity'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Productivity
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all backdrop-blur-sm ${
                  activeTab === 'career'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Career
              </button>
              <button
                onClick={() => setActiveTab('fitness')}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all backdrop-blur-sm ${
                  activeTab === 'fitness'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Fitness
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Current Task Card */}
            <NowCard />

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DSATracker />
              <GymCheckIn />
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {Math.floor(Math.random() * 30) + 15}
                  </div>
                  <div className="text-sm text-white/70">Day Streak</div>
                </div>
              </div>
            </div>

            {/* Life Goals Section */}
            <EditableGoalSection />

            {/* Schedule Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EditableSchedule 
                title="Daily Schedule (Mon-Fri)"
                scheduleKey="weekday"
                defaultSchedule={defaultWeekdaySchedule}
              />
              
              <div className="space-y-4">
                <div className="flex bg-white/10 rounded-2xl p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setActiveWeekendDay('saturday')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
                      activeWeekendDay === 'saturday' 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Saturday
                  </button>
                  <button
                    onClick={() => setActiveWeekendDay('sunday')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
                      activeWeekendDay === 'sunday' 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
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
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Daily Affirmation</h2>
              <blockquote className="text-lg leading-relaxed space-y-3">
                <p className="italic text-white/90">
                  "I am a high-performing operator. I show up even when I'm tired."
                </p>
                <p className="italic text-white/90">
                  "I move with clarity. I pray, I push, I reflect."
                </p>
                <p className="italic text-blue-300 font-semibold">
                  "My 12 LPA job already exists. I'm just catching up to it."
                </p>
              </blockquote>
            </div>
          </div>
        ) : activeTab === 'productivity' ? (
          <div className="space-y-8">
            {/* Focus Timer */}
            <FocusTimer />

            {/* Daily Tasks and Habits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DailyTodos />
              <HabitStreakView />
            </div>

            {/* Quick Notes and Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <QuickNotes />
              <WeeklyProgress />
            </div>
          </div>
        ) : activeTab === 'career' ? (
          <CareerTimeline />
        ) : (
          <FitnessTimeline />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
          <div className="text-center text-sm text-white/60">
            <p>LifeOS Dashboard • Stay focused, stay consistent, become unstoppable</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
