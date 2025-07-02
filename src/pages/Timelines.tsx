
import React from 'react';
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FitnessTimeline from '@/components/FitnessTimeline';
import CareerTimeline from '@/components/CareerTimeline';

const Timelines = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="relative z-10 p-6 pb-24 md:pb-8 md:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-black gradient-text mb-4 tracking-tight">
              Timelines
            </h1>
            <p className="text-2xl text-slate-300 font-medium tracking-wide">
              Track your transformation journey
            </p>
          </div>

          <Tabs defaultValue="fitness" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700 mb-8">
              <TabsTrigger value="fitness" className="data-[state=active]:bg-blue-600">
                🏋️ Fitness Timeline
              </TabsTrigger>
              <TabsTrigger value="career" className="data-[state=active]:bg-purple-600">
                💼 Career Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fitness" className="mt-6">
              <div className="glass-card rounded-3xl p-8">
                <FitnessTimeline />
              </div>
            </TabsContent>
            
            <TabsContent value="career" className="mt-6">
              <div className="glass-card rounded-3xl p-8">
                <CareerTimeline />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Timelines;
