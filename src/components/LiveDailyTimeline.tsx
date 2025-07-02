
import React, { useState, useEffect } from 'react';
import { Clock, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import TimelineBlock from './TimelineBlock';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';
import { parseTimeSlot, getCurrentTimeInMinutes } from '@/utils/timeHelpers';

const LiveDailyTimeline = () => {
  const { dailyBlocks, getCurrentBlock, updateDailyBlock, addDailyBlock, deleteDailyBlock, loading } = useOperatorSystem();
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
  const currentMinutes = getCurrentTimeInMinutes();

  // Enhanced block status detection
  const getBlockStatus = (block: any) => {
    if (block.completed) return 'completed';
    if (currentBlock?.id === block.id) return 'active';
    
    const timeSlot = parseTimeSlot(block.time_slot);
    if (!timeSlot) return 'upcoming';
    
    if (currentMinutes > timeSlot.end) return 'missed';
    if (currentMinutes > timeSlot.start) return 'active';
    return 'upcoming';
  };

  const handleCompleteBlock = async (blockId: string) => {
    try {
      await updateDailyBlock(blockId, { completed: true });
      toast({
        title: 'Success',
        description: 'Block completed! 🎯',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete block',
        variant: 'destructive',
      });
    }
  };

  const handleEditBlock = (block: any) => {
    setEditingBlock(block.id);
    setEditData({ task: block.task, time_slot: block.time_slot });
  };

  const handleSaveEdit = async () => {
    if (!editingBlock || !editData.task.trim()) {
      toast({
        title: 'Error',
        description: 'Task cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await updateDailyBlock(editingBlock, {
        task: editData.task,
        time_slot: editData.time_slot
      });
      
      setEditingBlock(null);
      setEditData({ task: '', time_slot: '' });
      toast({
        title: 'Success',
        description: 'Block updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update block',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBlock(null);
    setEditData({ task: '', time_slot: '' });
  };

  const handleAddBlock = async () => {
    if (!newBlock.time_slot.trim() || !newBlock.task.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
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
      toast({
        title: 'Success',
        description: 'Block added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add block',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deleteDailyBlock(blockId);
      toast({
        title: 'Success',
        description: 'Block deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete block',
        variant: 'destructive',
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-3 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 truncate">🕹️ Live Daily Timeline</h2>
              <p className="text-xs md:text-sm text-white/70 flex items-center gap-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="truncate">Current Time: {currentTimeStr}</span>
              </p>
            </div>
            <Dialog open={isAddingBlock} onOpenChange={setIsAddingBlock}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm flex-shrink-0">
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Add Block</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-md mx-4">
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

          {/* Enhanced Current Block Highlight */}
          {currentBlock && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-2 border-purple-500/50 rounded-2xl animate-pulse shadow-lg shadow-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="text-2xl md:text-3xl flex-shrink-0 animate-bounce">{currentBlock.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-xl font-bold text-white truncate">NOW: {currentBlock.task}</h3>
                    <p className="text-xs md:text-sm text-white/70 truncate">{currentBlock.time_slot}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!currentBlock.completed && (
                    <Button
                      onClick={() => handleCompleteBlock(currentBlock.id)}
                      className="bg-green-600 hover:bg-green-700 h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm font-semibold shadow-lg"
                    >
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Done
                    </Button>
                  )}
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
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

          {/* Enhanced Timeline with Status Indicators */}
          <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
            {dailyBlocks.map((block) => {
              const blockStatus = getBlockStatus(block);
              const isActive = blockStatus === 'active';
              const isPast = blockStatus === 'completed';
              const isMissed = blockStatus === 'missed';
              const isEditing = editingBlock === block.id;
              
              return (
                <div key={block.id} id={`block-${block.id}`}>
                  <TimelineBlock
                    block={block}
                    isActive={isActive}
                    isPast={isPast}
                    isMissed={isMissed}
                    isEditing={isEditing}
                    editData={editData}
                    onEdit={handleEditBlock}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    onComplete={handleCompleteBlock}
                    onDelete={handleDeleteBlock}
                    onEditDataChange={setEditData}
                  />
                </div>
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
