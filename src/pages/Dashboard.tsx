import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import Navigation from '@/components/Navigation';
import NowCard from '@/components/NowCard';
import LiveDailyTimeline from '@/components/LiveDailyTimeline';
import WeeklyProgress from '@/components/WeeklyProgress';
import DailyTodos from '@/components/DailyTodos';
import DSATracker from '@/components/DSATracker';
import FocusTimer from '@/components/FocusTimer';
import QuickNotes from '@/components/QuickNotes';
import SimpleGymCheckin from '@/components/SimpleGymCheckin';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SlipRecoveryOverlay from '@/components/SlipRecoveryOverlay';
import Footer from '@/components/Footer';

import VoiceReminder from '@/components/VoiceReminder';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSlipRecovery } from '@/hooks/useSlipRecovery';

const Dashboard = () => {
  const { user } = useAuth();
  const { isGuestMode } = useGuestMode();
  const { showSlipRecovery, setShowSlipRecovery, handleJumpToNext } = useSlipRecovery();

  const getGreeting = () => {
    if (isGuestMode) {
      return "Welcome back, User";
    }
    if (user?.user_metadata?.full_name) {
      return `Welcome Back, ${user.user_metadata.full_name}`;
    }
    return "Welcome Back";
  };

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
              {getGreeting()}
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-medium tracking-wide">
              Execute with precision. Track with purpose.
            </p>
          </div>



          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-12">
            {/* Left Column - Now Card */}
            <div className="lg:col-span-1">
              <ErrorBoundary>
                <NowCard />
              </ErrorBoundary>
            </div>

            {/* Right Column - Live Timeline */}
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <LiveDailyTimeline />
              </ErrorBoundary>
            </div>
          </div>

          {/* Productivity Tools Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-12">
            <ErrorBoundary>
              <FocusTimer />
            </ErrorBoundary>
            <ErrorBoundary>
              <QuickNotes />
            </ErrorBoundary>
            <ErrorBoundary>
              <SimpleGymCheckin />
            </ErrorBoundary>
          </div>

          {/* Weekly Progress Section */}
          <div className="mb-6 md:mb-12">
            <ErrorBoundary>
              <WeeklyProgress />
            </ErrorBoundary>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ErrorBoundary>
              <DailyTodos />
            </ErrorBoundary>
            <ErrorBoundary>
              <DSATracker />
            </ErrorBoundary>
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

      <Footer />
    </div>
  );
};

export default Dashboard;

