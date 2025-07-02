
import React, { useState, useEffect } from 'react';
import { Check, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const EditableDailyTimeline = () => {
  const { dailyBlocks, getCurrentBlock, updateDailyBlock, addDailyBlock, deleteDailyBlock, loading } = useOperatorSystem();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ time_slot: '', task: '', emoji: '' });
  const [isAddingBlock, setIsAddingBlock] = useState(false);
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

  const handleEdit = (block: any) => {
    setEditingBlock(block.id);
    setEditForm({
      time_slot: block.time_slot,
      task: block.task,
      emoji: block.emoji
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBlock) return;
    await updateDailyBlock(editingBlock, editForm);
    setEditingBlock(null);
  };

  const handleCancelEdit = () => {
    setEditingBlock(null);
    setEditForm({ time_slot: '', task: '', emoji: '' });
  };

  const handleCompleteBlock = async (blockId: string) => {
    await updateDailyBlock(blockId, { completed: true });
  };

  const handleAddBlock = async () => {
    if (!newBlock.time_slot || !newBlock.task) return;
    await addDailyBlock({
      ...newBlock,
      is_active: false,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    });
    setNewBlock({ time_slot: '', task: '', emoji: '⚡', block_type: 'routine' });
    setIsAddingBlock(false);
  };

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'gym': return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'study': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'college': return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'break': return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'routine': return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🕹️ Live Daily Timeline</h2>
            <p className="text-sm text-white/70">Current Time: {currentTimeStr}</p>
          </div>
          <Dialog open={isAddingBlock} onOpenChange={setIsAddingBlock}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
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
                <Button onClick={handleAddBlock} className="w-full bg-purple-600 hover:bg-purple-700">
                  Add Block
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Block Highlight */}
        {currentBlock && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-500/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl animate-pulse">{currentBlock.emoji}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">NOW: {currentBlock.task}</h3>
                  <p className="text-sm text-white/70">{currentBlock.time_slot}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!currentBlock.completed && (
                  <Button
                    onClick={() => handleCompleteBlock(currentBlock.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                )}
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {dailyBlocks.map((block) => {
            const isActive = currentBlock?.id === block.id;
            const isPast = block.completed;
            const isEditing = editingBlock === block.id;
            
            return (
              <div
                key={block.id}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-purple-500/50' 
                    : isPast
                    ? 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20 opacity-60'
                    : `bg-gradient-to-r ${getBlockTypeColor(block.block_type)}`
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        value={editForm.time_slot}
                        onChange={(e) => setEditForm(prev => ({ ...prev, time_slot: e.target.value }))}
                        className="bg-slate-800 border-slate-600 text-white text-sm"
                        placeholder="Time"
                      />
                      <Input
                        value={editForm.task}
                        onChange={(e) => setEditForm(prev => ({ ...prev, task: e.target.value }))}
                        className="bg-slate-800 border-slate-600 text-white text-sm"
                        placeholder="Task"
                      />
                      <Input
                        value={editForm.emoji}
                        onChange={(e) => setEditForm(prev => ({ ...prev, emoji: e.target.value }))}
                        className="bg-slate-800 border-slate-600 text-white text-sm"
                        placeholder="Emoji"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} size="sm" variant="outline" className="bg-red-600 hover:bg-red-700">
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{block.emoji}</div>
                      <div>
                        <h3 className={`font-semibold ${isActive ? 'text-white' : isPast ? 'text-green-300 line-through' : 'text-white'}`}>
                          {block.task}
                        </h3>
                        <p className="text-sm text-white/60">{block.time_slot}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPast && <Check className="w-5 h-5 text-green-400" />}
                      {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(block)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDailyBlock(block.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditableDailyTimeline;
