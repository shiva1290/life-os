
import React, { useState } from 'react';
import { weekendSchedule } from '../lib/timeUtils';

const WeekendRoutine = () => {
  const [activeDay, setActiveDay] = useState<'saturday' | 'sunday'>('saturday');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'border-l-blue-500 bg-blue-500/10';
      case 'break': return 'border-l-orange-500 bg-orange-500/10';
      case 'routine': return 'border-l-gray-500 bg-gray-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Weekend Schedule</h2>
        <div className="flex bg-secondary rounded-lg p-1">
          <button
            onClick={() => setActiveDay('saturday')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              activeDay === 'saturday' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Saturday
          </button>
          <button
            onClick={() => setActiveDay('sunday')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              activeDay === 'sunday' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sunday
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {weekendSchedule[activeDay].map((block, index) => {
          const typeColor = getTypeColor(block.type);
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${typeColor} hover:bg-secondary/50`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{block.emoji}</div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {block.task}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {block.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
        <h3 className="font-semibold mb-2">Weekend Focus</h3>
        <p className="text-sm text-muted-foreground">
          Weekends are for deep work on projects, DSA practice, and system design. 
          Balance intensive learning with adequate rest and social time.
        </p>
      </div>
    </div>
  );
};

export default WeekendRoutine;
