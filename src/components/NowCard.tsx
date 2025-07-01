
import React, { useState, useEffect } from 'react';
import { getCurrentTimeBlock, formatTime } from '../lib/timeUtils';

const NowCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentBlock, setCurrentBlock] = useState(getCurrentTimeBlock());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentBlock(getCurrentTimeBlock());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!currentBlock) return null;

  return (
    <div className="glass-card p-6 rounded-xl shadow-2xl border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-muted-foreground">Right Now</h2>
        <div className="text-sm text-muted-foreground font-mono">
          {formatTime(currentTime)}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-4xl animate-pulse-slow">
          {currentBlock.emoji}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold gradient-text mb-1">
            {currentBlock.task}
          </h3>
          <p className="text-muted-foreground">
            Scheduled for {currentBlock.time}
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm text-primary font-medium">
          💡 Stay focused on this single task. You're exactly where you need to be.
        </p>
      </div>
    </div>
  );
};

export default NowCard;
