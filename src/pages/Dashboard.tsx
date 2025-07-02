
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
import SlipRecoveryOverlay from '@/components/SlipRecoveryOverlay';
import QuoteRotationWidget from '@/components/QuoteRotationWidget';
import StreakCounters from '@/components/StreakCounters';
import VoiceReminder from '@/components/VoiceReminder';
import WeeklyExecutionBar from '@/components/WeeklyExecutionBar';
import { useSlipRecovery } from '@/hooks/useSlipRecovery';

const Dashboard = () => {
  const { user } = useAuth();
  const { showSlipRecovery, setShowSlipRecovery, handleJumpToNext } = useSlipRecovery();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="relative z-10 p-4 md:p-6 pb-20 md:pb-8 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-7xl font-black gradient-text mb-4 tracking-tight">
              Welcome Back, Shiva
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium tracking-wide">
              Execute with precision. Track with purpose.
            </p>
          </div>

          {/* Quote Rotation Widget */}
          <QuoteRotationWidget />

          {/* Streak Counters */}
          <StreakCounters />

          {/* Weekly Execution Bar */}
          <WeeklyExecutionBar />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            <WeeklyProgress />
            <WeeklyOperatorGrid />
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <DailyTodos />
            <DSATracker />
          </div>

          {/* Quick Actions */}
          <div className="mt-8 md:mt-12 flex flex-wrap gap-3 md:gap-4 justify-center px-2">
            <Link to="/tools">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm md:text-base">
                🛠️ Access Tools
              </Button>
            </Link>
            <Link to="/timelines">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm md:text-base">
                📊 View Timelines
              </Button>
            </Link>
            <Link to="/habits">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm md:text-base">
                🎯 Track Habits
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Voice Reminder Toggle */}
      <VoiceReminder />

      {/* Slip Recovery Overlay */}
      <SlipRecoveryOverlay
        isOpen={showSlipRecovery}
        onClose={() => setShowSlipRecovery(false)}
        onJumpToNext={handleJumpToNext}
      />
    </div>
  );
};

export default Dashboard;
