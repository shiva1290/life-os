
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';
import { Button } from './ui/button';

const NowCard = () => {
  const { getCurrentBlock, updateDailyBlock } = useOperatorSystem();
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentBlock = getCurrentBlock();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleCompleteBlock = async () => {
    if (currentBlock) {
      await updateDailyBlock(currentBlock.id, { completed: true });
    }
  };

  const currentTimeStr = currentTime.toTimeString().slice(0, 5);

  if (!currentBlock) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-white/10 rounded-3xl shadow-2xl p-6">
        <div className="text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-white/50" />
          <h2 className="text-2xl font-bold text-white mb-2">⏰ Free Time</h2>
          <p className="text-white/70">No scheduled block right now</p>
          <div className="text-3xl font-mono font-bold text-white/60 mt-4">
            {currentTimeStr}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-6">
        {/* Current Time */}
        <div className="text-center mb-4">
          <div className="text-2xl font-mono font-bold text-white/80">
            {currentTimeStr}
          </div>
          <div className="text-sm text-white/60">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Now Block */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-pulse">
            {currentBlock.emoji}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            NOW: {currentBlock.task}
          </h2>
          <p className="text-xl text-white/80 mb-4">
            {currentBlock.time_slot}
          </p>
          
          {/* Block Type Badge */}
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
            currentBlock.block_type === 'gym' ? 'bg-green-500/30 text-green-300' :
            currentBlock.block_type === 'study' ? 'bg-blue-500/30 text-blue-300' :
            currentBlock.block_type === 'college' ? 'bg-purple-500/30 text-purple-300' :
            currentBlock.block_type === 'break' ? 'bg-orange-500/30 text-orange-300' :
            'bg-gray-500/30 text-gray-300'
          }`}>
            {currentBlock.block_type.toUpperCase()}
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          {!currentBlock.completed ? (
            <Button
              onClick={handleCompleteBlock}
              className="w-full py-4 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
            >
              <CheckCircle className="w-6 h-6 mr-3" />
              Mark Complete
            </Button>
          ) : (
            <div className="w-full py-4 text-lg font-semibold bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-center">
              <CheckCircle className="w-6 h-6 inline mr-3" />
              Completed ✅
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 px-4 py-3 bg-white/5 rounded-2xl">
          <div className="flex justify-between items-center text-sm text-white/70">
            <span>Block Progress</span>
            <span>{currentBlock.completed ? '100%' : 'In Progress'}</span>
          </div>
          <div className="mt-2 w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentBlock.completed ? 'bg-green-500 w-full' : 'bg-purple-500 w-1/2'
              }`}
            />
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl">
          <p className="text-sm text-white/80 text-center italic">
            "Operators don't wait for motivation. They execute with discipline."
          </p>
        </div>
      </div>
    </div>
  );
};

export default NowCard;
