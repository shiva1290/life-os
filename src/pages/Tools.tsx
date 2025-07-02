
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="p-4 md:p-6 pb-20 md:pb-6 md:pt-20">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLy48L3N2Zz4=')] opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Operator Tools
            </h1>
            <p className="text-xl text-slate-300">
              Your productivity arsenal
            </p>
          </div>

          {/* Streaks & Weekly Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <GitHubStyleStreaks />
            <WeeklyOperatorGrid />
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <HabitTracker />
            <DailyTodos />
            <GymCheckIn />
            <FocusTimer />
          </div>

          {/* Notes Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickNotes />
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">🧠 Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-2xl">
                  <div className="text-2xl font-bold text-green-400">85%</div>
                  <div className="text-xs text-white/60">Execution Rate</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-2xl">
                  <div className="text-2xl font-bold text-blue-400">12</div>
                  <div className="text-xs text-white/60">Active Streak</div>
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
