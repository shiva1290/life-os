
import React, { useState } from 'react';
import NowCard from '../components/NowCard';
import GoalSection from '../components/GoalSection';
import DailyRoutine from '../components/DailyRoutine';
import WeekendRoutine from '../components/WeekendRoutine';
import FitnessTimeline from '../components/FitnessTimeline';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fitness'>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚡</div>
              <h1 className="text-xl font-bold gradient-text">LifeOS Dashboard</h1>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('fitness')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'fitness'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                Fitness Timeline
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Current Task Card */}
            <NowCard />

            {/* Life Goals Section */}
            <GoalSection />

            {/* Schedule Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              <DailyRoutine />
              <WeekendRoutine />
            </div>

            {/* Daily Affirmation */}
            <div className="glass-card p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold gradient-text mb-4">Daily Affirmation</h2>
              <blockquote className="text-lg leading-relaxed space-y-2">
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
        ) : (
          <FitnessTimeline />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>LifeOS Dashboard • Stay focused, stay consistent, become unstoppable</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
