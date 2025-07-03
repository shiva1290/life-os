import React from 'react';
import Navigation from '@/components/Navigation';
import HabitTracker from '@/components/HabitTracker';
import EnhancedHabitStreaks from '@/components/EnhancedHabitStreaks';
import FunctionalHabitStats from '@/components/FunctionalHabitStats';
import FunctionalHabitInsights from '@/components/FunctionalHabitInsights';
import FunctionalHabitGoals from '@/components/FunctionalHabitGoals';
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';

const Habits = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white">
      {/* Fixed background that covers full page */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black -z-10" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 -z-10" />
      
      <Navigation />
      
      <div className="relative z-10 p-3 md:p-6 pb-16 md:pb-8 pt-3 md:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-12 animate-slide-up">
            <h1 className="text-3xl md:text-7xl font-black gradient-text mb-2 md:mb-4 tracking-tight">
              Habit Mastery
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-medium tracking-wide">
              Build unstoppable momentum with daily habits
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-12">
            {/* Left Column - Daily Habit Tracker */}
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <HabitTracker />
              </ErrorBoundary>
            </div>

            {/* Right Column - Live Stats */}
            <div className="lg:col-span-1">
              <ErrorBoundary>
                <FunctionalHabitStats />
              </ErrorBoundary>
            </div>
          </div>

          {/* Full Width - Enhanced Streak Heatmap */}
          <div className="mb-6 md:mb-12">
            <ErrorBoundary>
              <EnhancedHabitStreaks />
            </ErrorBoundary>
          </div>

          {/* Additional Habit Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ErrorBoundary>
              <FunctionalHabitInsights />
            </ErrorBoundary>
            <ErrorBoundary>
              <FunctionalHabitGoals />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Habits;
