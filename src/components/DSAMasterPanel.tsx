
import React, { useState } from 'react';
import { Code, Trophy, Target, Plus, Trash2 } from 'lucide-react';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const DSAMasterPanel = () => {
  const { dsaCount, addDSAProblem, loading } = useSupabaseSync();
  const { addFocusSession } = useOperatorSystem();
  const [isAddingProblem, setIsAddingProblem] = useState(false);
  const [newProblem, setNewProblem] = useState({
    name: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    topic: ''
  });

  const handleAddProblem = async () => {
    if (!newProblem.name) return;
    
    await addDSAProblem();
    setNewProblem({ name: '', difficulty: 'medium', topic: '' });
    setIsAddingProblem(false);
  };

  const handleStartFocusSession = async () => {
    await addFocusSession({
      session_type: 'dsa',
      duration_minutes: 25,
      completed: false,
      notes: 'DSA Focus Session'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">📚 DSA Master Panel</h3>
              <p className="text-sm text-white/70">Striver Sheet Progress</p>
            </div>
          </div>
          <Dialog open={isAddingProblem} onOpenChange={setIsAddingProblem}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Problem
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add DSA Problem</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Problem name"
                  value={newProblem.name}
                  onChange={(e) => setNewProblem(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Input
                  placeholder="Topic (Arrays, Trees, etc.)"
                  value={newProblem.topic}
                  onChange={(e) => setNewProblem(prev => ({ ...prev, topic: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Select value={newProblem.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setNewProblem(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddProblem} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Problem
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-400">{dsaCount.today}</div>
            <div className="text-xs text-white/70">Today</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-400">{dsaCount.week}</div>
            <div className="text-xs text-white/70">This Week</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl font-bold text-orange-400">{dsaCount.streak}</div>
            <div className="text-xs text-white/70">Day Streak</div>
          </div>
        </div>

        {/* Striver Sheet Categories */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-white/80">Key Topics Progress</h4>
          {[
            { name: 'Arrays & Hashing', solved: 12, total: 20, color: 'bg-green-500' },
            { name: 'Two Pointers', solved: 8, total: 15, color: 'bg-blue-500' },
            { name: 'Stack & Queue', solved: 5, total: 12, color: 'bg-yellow-500' },
            { name: 'Binary Search', solved: 3, total: 10, color: 'bg-red-500' },
            { name: 'Trees & Graphs', solved: 2, total: 25, color: 'bg-purple-500' },
          ].map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${topic.color}`} />
                <span className="text-white text-sm">{topic.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">{topic.solved}/{topic.total}</span>
                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${topic.color} transition-all duration-300`}
                    style={{ width: `${(topic.solved / topic.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleStartFocusSession}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Target className="w-4 h-4 mr-2" />
            Start Focus
          </Button>
          <Button 
            onClick={addDSAProblem}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Mark Solved
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DSAMasterPanel;
