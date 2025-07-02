
import React from 'react';
import { Dumbbell, Check } from 'lucide-react';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';

const GymCheckIn = () => {
  const { gymCheckedIn, toggleGymCheckin, loading } = useSupabaseSync();

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
        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">Gym Check-in</h3>
      </div>
      
      <div className="text-center mb-4">
        <div className={`text-4xl mb-2 ${gymCheckedIn ? 'animate-bounce' : ''}`}>
          {gymCheckedIn ? '💪' : '🏋️‍♂️'}
        </div>
        <p className="text-white/70 text-sm">
          {gymCheckedIn ? 'Great job! You crushed it today!' : 'Ready to crush your workout?'}
        </p>
      </div>
      
      <button
        onClick={toggleGymCheckin}
        className={`w-full p-3 rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
          gymCheckedIn 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
        }`}
      >
        {gymCheckedIn && <Check className="w-5 h-5" />}
        {gymCheckedIn ? 'Checked In!' : 'Check In'}
      </button>
      
      {gymCheckedIn && (
        <p className="text-center text-white/50 text-xs mt-2">
          Checked in at {new Date().toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default GymCheckIn;
