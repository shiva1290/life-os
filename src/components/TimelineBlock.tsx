
import React from 'react';
import { CheckCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TimelineBlockProps {
  block: any;
  isActive: boolean;
  isPast: boolean;
  isEditing: boolean;
  editData: { task: string; time_slot: string };
  onEdit: (block: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEditDataChange: (data: { task: string; time_slot: string }) => void;
}

const TimelineBlock = ({
  block,
  isActive,
  isPast,
  isEditing,
  editData,
  onEdit,
  onSave,
  onCancel,
  onComplete,
  onDelete,
  onEditDataChange
}: TimelineBlockProps) => {
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

  if (isEditing) {
    return (
      <div className="p-3 md:p-4 rounded-2xl border bg-gradient-to-r from-slate-500/20 to-slate-600/20 border-slate-500/30">
        <div className="space-y-2 md:space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              value={editData.time_slot}
              onChange={(e) => onEditDataChange({ ...editData, time_slot: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-sm h-8 md:h-10"
              placeholder="Time slot"
            />
            <Input
              value={editData.task}
              onChange={(e) => onEditDataChange({ ...editData, task: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-sm h-8 md:h-10"
              placeholder="Task"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSave} size="sm" className="bg-green-600 hover:bg-green-700 h-8 px-3 text-xs">
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button onClick={onCancel} size="sm" variant="outline" className="bg-white/10 border-white/20 text-white h-8 px-3 text-xs">
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 md:p-4 rounded-2xl border transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-purple-500/50 scale-[1.02]' 
          : isPast
          ? 'bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20 opacity-60'
          : `bg-gradient-to-r ${getBlockTypeColor(block.block_type)}`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className="text-lg md:text-2xl flex-shrink-0">{block.emoji}</div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-sm md:text-base truncate ${
              isActive ? 'text-white' : isPast ? 'text-green-300 line-through' : 'text-white'
            }`}>
              {block.task}
            </h3>
            <p className="text-xs md:text-sm text-white/60 truncate">{block.time_slot}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {isPast && <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />}
          {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(block)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 h-8 w-8 p-0"
          >
            <Edit className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(block.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8 p-0"
          >
            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimelineBlock;
