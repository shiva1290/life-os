
import React, { useState, useEffect } from 'react';
import { Code, Plus, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';

interface DSAProblem {
  id: string;
  problem_name: string;
  difficulty: string;
  topic: string;
  solved_date: string;
  created_at: string;
}

const SimplifiedDSAPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentProblems, setRecentProblems] = useState<DSAProblem[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddingProblem, setIsAddingProblem] = useState(false);
  const [newProblem, setNewProblem] = useState({
    name: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    topic: ''
  });

  useEffect(() => {
    if (user) {
      fetchRecentProblems();
    }
  }, [user]);

  const fetchRecentProblems = async () => {
    if (!user) return;

    try {
      // Fetch recent 5 problems
      const { data: recentData, error: recentError } = await supabase
        .from('dsa_problems')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentProblems(recentData || []);

      // Count today's problems
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData, error: todayError } = await supabase
        .from('dsa_problems')
        .select('*')
        .eq('user_id', user.id)
        .eq('solved_date', today);

      if (todayError) throw todayError;
      setTodayCount(todayData?.length || 0);

    } catch (error) {
      console.error('Error fetching DSA data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async () => {
    if (!newProblem.name || !user) return;

    try {
      const { error } = await supabase
        .from('dsa_problems')
        .insert([{
          problem_name: newProblem.name,
          difficulty: newProblem.difficulty,
          topic: newProblem.topic,
          user_id: user.id,
          solved_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      toast({
        title: "🎯 Problem Added!",
        description: `${newProblem.name} has been logged`,
      });

      setNewProblem({ name: '', difficulty: 'medium', topic: '' });
      setIsAddingProblem(false);
      fetchRecentProblems();
    } catch (error) {
      console.error('Error adding problem:', error);
      toast({
        title: "Error",
        description: "Failed to add problem",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-white bg-white/20';
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
    <div className="glass-card rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">💻 DSA Progress</h3>
              <p className="text-sm text-white/70">Recent Problems</p>
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
        
        {/* Today's Progress */}
        <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm mb-6">
          <div className="text-4xl font-bold text-green-400">{todayCount}</div>
          <div className="text-xs text-white/70">Problems Today</div>
        </div>

        {/* Recent Problems */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white/80">Recent Problems</h4>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              <ExternalLink className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          
          {recentProblems.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Code className="w-12 h-12 mx-auto mb-4" />
              <p>No problems solved yet</p>
              <p className="text-sm">Add your first problem to get started!</p>
            </div>
          ) : (
            recentProblems.map((problem) => (
              <div key={problem.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex-1">
                  <div className="font-medium text-white text-sm">{problem.problem_name}</div>
                  <div className="text-xs text-white/60">{problem.topic || 'General'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-white/60">
                    {new Date(problem.solved_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplifiedDSAPanel;
