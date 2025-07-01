
import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit } from 'lucide-react';

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

  // Load todos from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`todos-${today}`);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`todos-${today}`, JSON.stringify(todos));
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
      case 'high': return 'border-l-red-500 bg-red-500/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-l-green-500 bg-green-500/10';
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
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Daily Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{todos.length} completed ({completionRate}%)
          </p>
        </div>
        <div className="text-3xl animate-pulse-slow">✅</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Add New Todo */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Todo['category'])}
            className="px-3 py-1 bg-secondary border border-border rounded text-sm text-foreground"
          >
            <option value="study">📚 Study</option>
            <option value="gym">🏋️ Gym</option>
            <option value="personal">👤 Personal</option>
            <option value="college">🎓 College</option>
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Todo['priority'])}
            className="px-3 py-1 bg-secondary border border-border rounded text-sm text-foreground"
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 rounded-lg border-l-4 transition-all ${getPriorityColor(todo.priority)} ${
              todo.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground hover:border-primary'
                }`}
              >
                {todo.completed && <Check size={12} className="text-primary-foreground" />}
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
                    className="w-full px-2 py-1 bg-secondary border border-border rounded text-foreground"
                    autoFocus
                  />
                ) : (
                  <span className={`${todo.completed ? 'line-through' : ''}`}>
                    {todo.text}
                  </span>
                )}
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(todo)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <p>No tasks yet. Add one above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTodos;
