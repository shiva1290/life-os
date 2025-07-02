
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import NowCard from '@/components/NowCard';
import LiveDailyTimeline from '@/components/LiveDailyTimeline';
import WeeklyProgress from '@/components/WeeklyProgress';
import WeeklyOperatorGrid from '@/components/WeeklyOperatorGrid';
import DailyTodos from '@/components/DailyTodos';
import DSATracker from '@/components/DSATracker';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="relative z-10 p-6 pb-32 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-black gradient-text mb-4 tracking-tight">
              Welcome Back, Operator
            </h1>
            <p className="text-2xl text-slate-300 font-medium tracking-wide">
              Execute with precision. Track with purpose.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Now Card */}
            <div className="lg:col-span-1">
              <NowCard />
            </div>

            {/* Right Column - Live Timeline */}
            <div className="lg:col-span-2">
              <LiveDailyTimeline />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <WeeklyProgress />
            <WeeklyOperatorGrid />
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DailyTodos />
            <DSATracker />
          </div>

          {/* Quick Actions */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/tools">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                🛠️ Access Tools
              </Button>
            </Link>
            <Link to="/timelines">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                📊 View Timelines
              </Button>
            </Link>
            <Link to="/habits">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                🎯 Track Habits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
