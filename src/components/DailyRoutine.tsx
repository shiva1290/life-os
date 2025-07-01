
import React from 'react';
import { weekdaySchedule, isCurrentTimeBlock, TimeBlock } from '../lib/timeUtils';

const DailyRoutine = () => {
  const getTypeColor = (type: TimeBlock['type']) => {
    switch (type) {
      case 'gym': return 'border-l-green-500 bg-green-500/10';
      case 'study': return 'border-l-blue-500 bg-blue-500/10';
      case 'college': return 'border-l-purple-500 bg-purple-500/10';
      case 'break': return 'border-l-orange-500 bg-orange-500/10';
      case 'routine': return 'border-l-gray-500 bg-gray-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Daily Schedule</h2>
        <div className="text-sm text-muted-foreground">Monday - Friday</div>
      </div>

      <div className="space-y-2">
        {weekdaySchedule.map((block, index) => {
          const isCurrent = isCurrentTimeBlock(block);
          const typeColor = getTypeColor(block.type);
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${typeColor} ${
                isCurrent ? 'current-task scale-[1.02]' : 'hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{block.emoji}</div>
                  <div>
                    <h3 className={`font-semibold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {block.task}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {block.time} {isCurrent && '• Active Now'}
                    </p>
                  </div>
                </div>
                {isCurrent && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-primary font-medium">NOW</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
        <h3 className="font-semibold mb-2">Legend</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Gym & Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Study & DSA</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>College</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Break & Rest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRoutine;
