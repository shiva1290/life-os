
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';

export interface TimeBlock {
  id: string;
  time: string;
  task: string;
  emoji: string;
  type: 'gym' | 'study' | 'college' | 'break' | 'routine';
}

interface EditableScheduleProps {
  title: string;
  scheduleKey: string;
  defaultSchedule: TimeBlock[];
  isWeekend?: boolean;
}

const EditableSchedule = ({ title, scheduleKey, defaultSchedule, isWeekend = false }: EditableScheduleProps) => {
  const [schedule, setSchedule] = useState<TimeBlock[]>(defaultSchedule);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ time: '', task: '', emoji: '', type: 'routine' as TimeBlock['type'] });
  const [showAddForm, setShowAddForm] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`schedule-${scheduleKey}`);
    if (saved) {
      setSchedule(JSON.parse(saved));
    }
  }, [scheduleKey]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`schedule-${scheduleKey}`, JSON.stringify(schedule));
  }, [schedule, scheduleKey]);

  const getCurrentTimeBlock = (): TimeBlock | null => {
    if (isWeekend) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    for (let i = 0; i < schedule.length; i++) {
      const [hour, minute] = schedule[i].time.split(':').map(Number);
      const blockTime = hour * 60 + minute;
      
      if (i === schedule.length - 1 || currentTime < blockTime) {
        return schedule[i];
      }
      
      if (i < schedule.length - 1) {
        const [nextHour, nextMinute] = schedule[i + 1].time.split(':').map(Number);
        const nextBlockTime = nextHour * 60 + nextMinute;
        
        if (currentTime >= blockTime && currentTime < nextBlockTime) {
          return schedule[i];
        }
      }
    }
    
    return schedule[0];
  };

  const isCurrentTimeBlock = (timeBlock: TimeBlock): boolean => {
    const current = getCurrentTimeBlock();
    return current?.id === timeBlock.id;
  };

  const startEdit = (block: TimeBlock) => {
    setEditingId(block.id);
    setEditForm({
      time: block.time,
      task: block.task,
      emoji: block.emoji,
      type: block.type
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    setSchedule(prev => prev.map(block => 
      block.id === editingId 
        ? { ...block, ...editForm }
        : block
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ time: '', task: '', emoji: '', type: 'routine' });
  };

  const deleteBlock = (id: string) => {
    setSchedule(prev => prev.filter(block => block.id !== id));
  };

  const addNewBlock = () => {
    if (!editForm.time || !editForm.task) return;
    
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      ...editForm
    };
    
    setSchedule(prev => [...prev, newBlock].sort((a, b) => {
      const [aHour, aMin] = a.time.split(':').map(Number);
      const [bHour, bMin] = b.time.split(':').map(Number);
      return (aHour * 60 + aMin) - (bHour * 60 + bMin);
    }));
    
    setEditForm({ time: '', task: '', emoji: '', type: 'routine' });
    setShowAddForm(false);
  };

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
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add New Block Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-secondary/50 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="time"
              value={editForm.time}
              onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
              className="px-3 py-2 bg-background border border-border rounded text-foreground"
            />
            <select
              value={editForm.type}
              onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as TimeBlock['type'] }))}
              className="px-3 py-2 bg-background border border-border rounded text-foreground"
            >
              <option value="routine">Routine</option>
              <option value="gym">Gym</option>
              <option value="study">Study</option>
              <option value="college">College</option>
              <option value="break">Break</option>
            </select>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Emoji"
              value={editForm.emoji}
              onChange={(e) => setEditForm(prev => ({ ...prev, emoji: e.target.value }))}
              className="px-3 py-2 bg-background border border-border rounded text-foreground"
            />
            <input
              type="text"
              placeholder="Task description"
              value={editForm.task}
              onChange={(e) => setEditForm(prev => ({ ...prev, task: e.target.value }))}
              className="px-3 py-2 bg-background border border-border rounded text-foreground col-span-3"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addNewBlock}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="space-y-2">
        {schedule.map((block) => {
          const isCurrent = isCurrentTimeBlock(block);
          const typeColor = getTypeColor(block.type);
          const isEditing = editingId === block.id;
          
          return (
            <div
              key={block.id}
              className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${typeColor} ${
                isCurrent ? 'current-task scale-[1.02]' : 'hover:bg-secondary/50'
              }`}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                      className="px-3 py-2 bg-background border border-border rounded text-foreground"
                    />
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as TimeBlock['type'] }))}
                      className="px-3 py-2 bg-background border border-border rounded text-foreground"
                    >
                      <option value="routine">Routine</option>
                      <option value="gym">Gym</option>
                      <option value="study">Study</option>
                      <option value="college">College</option>
                      <option value="break">Break</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={editForm.emoji}
                      onChange={(e) => setEditForm(prev => ({ ...prev, emoji: e.target.value }))}
                      className="px-3 py-2 bg-background border border-border rounded text-foreground"
                    />
                    <input
                      type="text"
                      value={editForm.task}
                      onChange={(e) => setEditForm(prev => ({ ...prev, task: e.target.value }))}
                      className="px-3 py-2 bg-background border border-border rounded text-foreground col-span-3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors flex items-center gap-1"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
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
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <div className="flex items-center space-x-2 mr-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs text-primary font-medium">NOW</span>
                      </div>
                    )}
                    <button
                      onClick={() => startEdit(block)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditableSchedule;
