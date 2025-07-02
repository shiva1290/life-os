
import React from 'react';
import { Code } from 'lucide-react';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';

const DSATracker = () => {
  const { dsaCount, addDSAProblem, loading } = useSupabaseSync();

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <Code className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">DSA Progress</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-400">{dsaCount.today}</div>
          <div className="text-xs text-white/70">Today</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-400">{dsaCount.week}</div>
          <div className="text-xs text-white/70">This Week</div>
        </div>
        <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <div className="text-2xl font-bold text-orange-400">{dsaCount.streak}</div>
          <div className="text-xs text-white/70">Day Streak</div>
        </div>
      </div>
      
      <button
        onClick={addDSAProblem}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
      >
        + Solved a Problem
      </button>
    </div>
  );
};

export default DSATracker;
