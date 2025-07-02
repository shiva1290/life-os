
import React from 'react';
import Navigation from '@/components/Navigation';
import FocusTimer from '@/components/FocusTimer';
import QuickNotes from '@/components/QuickNotes';
import DSAMasterPanel from '@/components/DSAMasterPanel';
import GymCheckIn from '@/components/GymCheckIn';

const Tools = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="relative z-10 p-4 md:p-6 pb-20 md:pb-8 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-7xl font-black gradient-text mb-4 tracking-tight">
              Operator Tools
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium tracking-wide">
              Forge your discipline with precision instruments
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <FocusTimer />
            <QuickNotes />
            <DSAMasterPanel />
            <GymCheckIn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
