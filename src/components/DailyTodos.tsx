import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit, Archive, Calendar } from 'lucide-react';
import { DataService } from '../lib/dataService';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'study' | 'gym' | 'personal' | 'college';
  createdAt: string;
}

const DailyTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Todo['priority']>('medium');
  const [selectedCategory, setSelectedCategory] = useState<Todo['category']>('study');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [archivedTodos, setArchivedTodos] = useState<any[]>([]);

  // Load todos and check for daily reset
  useEffect(() => {
    DataService.getInstance().checkDailyReset();
    
    const saved = localStorage.getItem('daily-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }

    const archived = localStorage.getItem('archived-todos');
    if (archived) {
      setArchivedTodos(JSON.parse(archived));
    }
  }, []);

  // Save todos to localStorage and broadcast changes
  useEffect(() => {
    localStorage.setItem('daily-todos', JSON.stringify(todos));
    DataService.getInstance().broadcastChange('todos', todos);
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };
    
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500/50 bg-red-500/10';
      case 'medium': return 'border-l-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-l-green-500/50 bg-green-500/10';
    }
  };

  const getCategoryEmoji = (category: Todo['category']) => {
    switch (category) {
      case 'study': return '📚';
      case 'gym': return '🏋️';
      case 'personal': return '👤';
      case 'college': return '🎓';
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const completionRate = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Daily Tasks</h2>
            <p className="text-sm text-white/70">
              {completedCount}/{todos.length} completed ({completionRate}%)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <Archive className="w-5 h-5 text-white" />
            </button>
            <div className="text-3xl animate-pulse-slow">✅</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 shadow-lg"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {showArchived ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Past Completed Tasks</h3>
            </div>
            {archivedTodos.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <Archive size={48} className="mx-auto mb-4 opacity-50" />
                <p>No archived tasks yet</p>
              </div>
            ) : (
              archivedTodos.slice(-7).reverse().map((archive, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="font-medium text-white mb-2">{archive.date}</h4>
                  <div className="space-y-2">
                    {archive.todos.map((todo: Todo) => (
                      <div key={todo.id} className="flex items-center gap-2 text-sm text-white/70">
                        <Check size={14} className="text-green-400" />
                        <span>{todo.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            {/* Add New Todo */}
            <div className="mb-6 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button
                  onClick={addTodo}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Todo['category'])}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm"
                >
                  <option value="study">📚 Study</option>
                  <option value="gym">🏋️ Gym</option>
                  <option value="personal">👤 Personal</option>
                  <option value="college">🎓 College</option>
                </select>
                
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Todo['priority'])}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm"
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 rounded-2xl border-l-4 transition-all backdrop-blur-sm ${getPriorityColor(todo.priority)} ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-white/50 hover:border-green-500'
                      }`}
                    >
                      {todo.completed && <Check size={12} className="text-white" />}
                    </button>
                    
                    <div className="text-lg">{getCategoryEmoji(todo.category)}</div>
                    
                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          onBlur={saveEdit}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm"
                          autoFocus
                        />
                      ) : (
                        <span className={`text-white ${todo.completed ? 'line-through' : ''}`}>
                          {todo.text}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-2 text-white/60 hover:text-white transition-colors rounded-xl hover:bg-white/10"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors rounded-xl hover:bg-white/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {todos.length === 0 && (
                <div className="text-center py-8 text-white/60">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No tasks yet. Add one above to get started!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyTodos;
