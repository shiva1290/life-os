
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FitnessTimeline from '@/components/FitnessTimeline';
import CareerTimeline from '@/components/CareerTimeline';

const Timelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Transformation Timelines
          </h1>
          <p className="text-xl text-slate-300">
            Your journey to mastery and success
          </p>
        </div>

        <Tabs defaultValue="fitness" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="fitness" className="data-[state=active]:bg-blue-600">
              🏋️ Fitness Timeline
            </TabsTrigger>
            <TabsTrigger value="career" className="data-[state=active]:bg-purple-600">
              💼 Career Timeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fitness" className="mt-6">
            <FitnessTimeline />
          </TabsContent>
          
          <TabsContent value="career" className="mt-6">
            <CareerTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Timelines;
