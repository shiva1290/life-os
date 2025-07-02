
import React, { useState, useEffect } from 'react';
import { Dumbbell, Check } from 'lucide-react';

const GymCheckIn = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');

  useEffect(() => {
    const today = new Date().toDateString();
    const gymData = JSON.parse(localStorage.getItem('gym-checkins') || '{}');
    
    if (gymData[today]) {
      setIsCheckedIn(true);
      setCheckInTime(gymData[today]);
    }
  }, []);

  const toggleCheckIn = () => {
    const today = new Date().toDateString();
    const gymData = JSON.parse(localStorage.getItem('gym-checkins') || '{}');
    
    if (isCheckedIn) {
      delete gymData[today];
      setIsCheckedIn(false);
      setCheckInTime('');
    } else {
      const time = new Date().toLocaleTimeString();
      gymData[today] = time;
      setIsCheckedIn(true);
      setCheckInTime(time);
    }
    
    localStorage.setItem('gym-checkins', JSON.stringify(gymData));
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">Gym Check-in</h3>
      </div>
      
      <button
        onClick={toggleCheckIn}
        className={`w-full p-4 rounded-2xl border-2 transition-all ${
          isCheckedIn
            ? 'bg-green-500/20 border-green-500/50 text-green-300'
            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isCheckedIn ? 'bg-green-500 border-green-500' : 'border-white/50'
          }`}>
            {isCheckedIn && <Check size={16} className="text-white" />}
          </div>
          <span className="font-medium">
            {isCheckedIn ? 'Gym Done!' : 'Mark Gym Complete'}
          </span>
        </div>
      </button>
      
      {isCheckedIn && (
        <div className="mt-3 text-center text-sm text-green-300">
          ✅ Completed at {checkInTime}
        </div>
      )}
    </div>
  );
};

export default GymCheckIn;
