
import React from 'react';
import Navigation from "@/components/Navigation";
import NowCard from "@/components/NowCard";
import LiveDailyTimeline from "@/components/LiveDailyTimeline";
import DSAMasterPanel from "@/components/DSAMasterPanel";
import WeeklyProgress from "@/components/WeeklyProgress";
import UserProfile from "@/components/UserProfile";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Enhanced background with absolute black */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="relative z-10 p-6 pb-24 md:pb-8 md:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-12 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-7xl font-black gradient-text mb-4 tracking-tight">
                  Operator Dashboard
                </h1>
                <p className="text-2xl text-slate-300 font-medium tracking-wide">
                  Execute with precision. No compromises.
                </p>
              </div>
              <div className="animate-float">
                <UserProfile />
              </div>
            </div>
          </div>

          {/* Main Focus - Enhanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* NOW Card - Hero Focus */}
            <div className="lg:col-span-2 animate-slide-up">
              <div className="glass-card-intense rounded-3xl card-hover">
                <NowCard />
              </div>
            </div>
            
            {/* Weekly Progress */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="glass-card rounded-3xl card-hover h-full">
                <WeeklyProgress />
              </div>
            </div>
          </div>

          {/* Secondary Row - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Timeline */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card rounded-3xl card-hover">
                <LiveDailyTimeline />
              </div>
            </div>
            
            {/* DSA Progress */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="glass-card rounded-3xl card-hover">
                <DSAMasterPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
