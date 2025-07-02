
import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'study' | 'gym' | 'personal' | 'college';
  created_date: string;
}

const DailyTodos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: '',
    priority: 'medium' as const,
    category: 'study' as const
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('created_date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!user || !newTodo.text.trim()) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          text: newTodo.text,
          priority: newTodo.priority,
          category: newTodo.category,
          user_id: user.id,
          completed: false,
          created_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;
      setTodos(prev => [data, ...prev]);
      setNewTodo({ text: '', priority: 'medium', category: 'study' });
      setIsAddingTodo(false);
      
      toast({
        title: "Success!",
        description: "Task added successfully",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    if (!user) return;

    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Success!",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-500/20 text-blue-300';
      case 'gym': return 'bg-green-500/20 text-green-300';
      case 'personal': return 'bg-purple-500/20 text-purple-300';
      case 'college': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
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
            <CheckSquare className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">📋 Daily Tasks</h3>
              <p className="text-sm text-white/70">Today's mission critical items</p>
            </div>
          </div>
          <Dialog open={isAddingTodo} onOpenChange={setIsAddingTodo}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Task description"
                  value={newTodo.text}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, text: e.target.value }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Select value={newTodo.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTodo(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newTodo.category} onValueChange={(value: 'study' | 'gym' | 'personal' | 'college') => setNewTodo(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addTodo} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                todo.completed
                  ? 'bg-green-500/10 border-green-500/30 opacity-60'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTodo(todo.id)}
                    className={todo.completed ? 'text-green-400' : 'text-white hover:text-green-400'}
                  >
                    {todo.completed ? <CheckSquare className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </Button>
                  <div className="flex-1">
                    <p className={`font-medium ${todo.completed ? 'text-green-300 line-through' : 'text-white'}`}>
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(todo.category)}`}>
                        {todo.category}
                      </span>
                      <span className={`text-xs font-semibold ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <CheckSquare className="w-12 h-12 mx-auto mb-4" />
              <p>No tasks for today. Add your first task to get started!</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{todos.filter(t => t.completed).length}</div>
              <div className="text-xs text-white/60">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-400">{todos.filter(t => !t.completed).length}</div>
              <div className="text-xs text-white/60">Remaining</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">{todos.length}</div>
              <div className="text-xs text-white/60">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTodos;
