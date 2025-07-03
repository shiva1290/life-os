
import React from 'react';
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FitnessTimeline from '@/components/FitnessTimeline';
import CareerTimeline from '@/components/CareerTimeline';
import Footer from '@/components/Footer';

const Timelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
      {/* Fixed background that covers full page */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black -z-10" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 -z-10" />
      
      <Navigation />
      
      <div className="relative z-10 p-4 md:p-6 pb-20 md:pb-8 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-7xl font-black gradient-text mb-4 tracking-tight">
              Timelines
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium tracking-wide">
              Track your transformation journey
            </p>
          </div>

          <Tabs defaultValue="fitness" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card border border-white/10 mb-8">
              <TabsTrigger value="fitness" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                🏋️ Fitness Timeline
              </TabsTrigger>
              <TabsTrigger value="career" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                💼 Career Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fitness" className="mt-6">
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <FitnessTimeline />
              </div>
            </TabsContent>
            
            <TabsContent value="career" className="mt-6">
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <CareerTimeline />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Timelines;
