
import React from 'react';
import Navigation from "@/components/Navigation";
import HabitTracker from "@/components/HabitTracker";
import DailyTodos from "@/components/DailyTodos";
import QuickNotes from "@/components/QuickNotes";
import GymCheckIn from "@/components/GymCheckIn";
import FocusTimer from "@/components/FocusTimer";
import GitHubStyleStreaks from "@/components/GitHubStyleStreaks";
import WeeklyOperatorGrid from "@/components/WeeklyOperatorGrid";

const Tools = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="relative z-10 p-6 pb-24 md:pb-8 md:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-black gradient-text mb-4 tracking-tight">
              Operator Tools
            </h1>
            <p className="text-2xl text-slate-300 font-medium tracking-wide">
              Your productivity arsenal
            </p>
          </div>

          {/* Streaks & Weekly Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="animate-slide-up">
              <div className="glass-card rounded-3xl card-hover">
                <GitHubStyleStreaks />
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="glass-card rounded-3xl card-hover">
                <WeeklyOperatorGrid />
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card rounded-3xl card-hover h-full">
                <HabitTracker />
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="glass-card rounded-3xl card-hover h-full">
                <DailyTodos />
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="glass-card rounded-3xl card-hover h-full">
                <GymCheckIn />
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="glass-card rounded-3xl card-hover h-full">
                <FocusTimer />
              </div>
            </div>
          </div>

          {/* Notes & Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="glass-card-intense rounded-3xl card-hover">
                <QuickNotes />
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <div className="glass-card rounded-3xl p-8 card-hover">
                <h3 className="text-2xl font-bold gradient-text mb-6">🧠 Quick Stats</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="text-center p-6 glass-card rounded-2xl">
                    <div className="text-4xl font-black gradient-text mb-2">85%</div>
                    <div className="text-sm text-slate-400 font-medium">Execution Rate</div>
                  </div>
                  <div className="text-center p-6 glass-card rounded-2xl">
                    <div className="text-4xl font-black gradient-text mb-2">12</div>
                    <div className="text-sm text-slate-400 font-medium">Active Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
