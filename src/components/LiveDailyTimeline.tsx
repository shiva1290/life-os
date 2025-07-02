
import React, { useState, useEffect } from 'react';
import { Clock, Plus } from 'lucide-react';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';
import { useToast } from '@/hooks/useToast';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import TimelineBlock from './TimelineBlock';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

const LiveDailyTimeline = () => {
  const { dailyBlocks, getCurrentBlock, updateDailyBlock, addDailyBlock, deleteDailyBlock, loading, error } = useOperatorSystem();
  const { showToast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editData, setEditData] = useState({ task: '', time_slot: '' });
  const [newBlock, setNewBlock] = useState({
    time_slot: '',
    task: '',
    emoji: '⚡',
    block_type: 'routine'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const currentBlock = getCurrentBlock();
  const currentTimeStr = currentTime.toTimeString().slice(0, 5);

  const handleCompleteBlock = async (blockId: string) => {
    try {
      await updateDailyBlock(blockId, { completed: true });
      showToast('success', 'Block completed! 🎯');
    } catch (error) {
      showToast('error', 'Failed to complete block');
    }
  };

  const handleEditBlock = (block: any) => {
    setEditingBlock(block.id);
    setEditData({ task: block.task, time_slot: block.time_slot });
  };

  const handleSaveEdit = async () => {
    if (!editingBlock || !editData.task.trim()) {
      showToast('error', 'Task cannot be empty');
      return;
    }
    
    try {
      await updateDailyBlock(editingBlock, {
        task: editData.task,
        time_slot: editData.time_slot
      });
      
      setEditingBlock(null);
      setEditData({ task: '', time_slot: '' });
      showToast('success', 'Block updated successfully');
    } catch (error) {
      showToast('error', 'Failed to update block');
    }
  };

  const handleCancelEdit = () => {
    setEditingBlock(null);
    setEditData({ task: '', time_slot: '' });
  };

  const handleAddBlock = async () => {
    if (!newBlock.time_slot.trim() || !newBlock.task.trim()) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    try {
      await addDailyBlock({
        ...newBlock,
        is_active: false,
        completed: false,
        date: new Date().toISOString().split('T')[0]
      });

      setNewBlock({ time_slot: '', task: '', emoji: '⚡', block_type: 'routine' });
      setIsAddingBlock(false);
      showToast('success', 'Block added successfully');
    } catch (error) {
      showToast('error', 'Failed to add block');
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deleteDailyBlock(blockId);
      showToast('success', 'Block deleted');
    } catch (error) {
      showToast('error', 'Failed to delete block');
    }
  };

  return (
    <ErrorBoundary>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">🕹️ Live Daily Timeline</h2>
              <p className="text-xs md:text-sm text-white/70 flex items-center gap-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                Current Time: {currentTimeStr}
              </p>
            </div>
            <Dialog open={isAddingBlock} onOpenChange={setIsAddingBlock}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm">
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Add Block
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Daily Block</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Time slot (e.g., 09:00-10:00)"
                    value={newBlock.time_slot}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, time_slot: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Task description"
                    value={newBlock.task}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, task: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Emoji"
                      value={newBlock.emoji}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, emoji: e.target.value }))}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <Select value={newBlock.block_type} onValueChange={(value) => setNewBlock(prev => ({ ...prev, block_type: value }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                        <SelectItem value="break">Break</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddBlock} className="w-full bg-purple-600 hover:bg-purple-700">
                    Add Block
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Current Block Highlight */}
          {currentBlock && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-500/50 rounded-2xl animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="text-2xl md:text-3xl flex-shrink-0">{currentBlock.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white truncate">NOW: {currentBlock.task}</h3>
                    <p className="text-xs md:text-sm text-white/70 truncate">{currentBlock.time_slot}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!currentBlock.completed && (
                    <Button
                      onClick={() => handleCompleteBlock(currentBlock.id)}
                      className="bg-green-600 hover:bg-green-700 h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm"
                    >
                      Done
                    </Button>
                  )}
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 text-red-400">
              <p className="text-sm">Failed to load timeline. Please try again.</p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
            {dailyBlocks.map((block) => {
              const isActive = currentBlock?.id === block.id;
              const isPast = block.completed;
              const isEditing = editingBlock === block.id;
              
              return (
                <TimelineBlock
                  key={block.id}
                  block={block}
                  isActive={isActive}
                  isPast={isPast}
                  isEditing={isEditing}
                  editData={editData}
                  onEdit={handleEditBlock}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  onComplete={handleCompleteBlock}
                  onDelete={handleDeleteBlock}
                  onEditDataChange={setEditData}
                />
              );
            })}
          </div>

          {!loading && dailyBlocks.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <Clock className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-4" />
              <p className="text-sm md:text-base">No blocks scheduled for today. Add your first block to get started!</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LiveDailyTimeline;
