
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  timestamp: string;
  category: 'idea' | 'reminder' | 'learning' | 'reflection';
}

const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Note['category']>('idea');

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quick-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('quick-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      timestamp: new Date().toLocaleString(),
      category: selectedCategory,
    };
    
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const getCategoryEmoji = (category: Note['category']) => {
    switch (category) {
      case 'idea': return '💡';
      case 'reminder': return '⏰';
      case 'learning': return '📚';
      case 'reflection': return '🤔';
    }
  };

  const getCategoryColor = (category: Note['category']) => {
    switch (category) {
      case 'idea': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'reminder': return 'border-l-red-500 bg-red-500/10';
      case 'learning': return 'border-l-blue-500 bg-blue-500/10';
      case 'reflection': return 'border-l-purple-500 bg-purple-500/10';
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Quick Notes</h2>
        <div className="text-3xl animate-pulse-slow">📝</div>
      </div>

      {/* Add New Note */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Capture your thoughts, ideas, or reminders..."
            className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={2}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addNote())}
          />
          <button
            onClick={addNote}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 self-start"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Note['category'])}
          className="px-3 py-1 bg-secondary border border-border rounded text-sm text-foreground"
        >
          <option value="idea">💡 Idea</option>
          <option value="reminder">⏰ Reminder</option>
          <option value="learning">📚 Learning</option>
          <option value="reflection">🤔 Reflection</option>
        </select>
      </div>

      {/* Notes List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 rounded-lg border-l-4 transition-all ${getCategoryColor(note.category)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-xl">{getCategoryEmoji(note.category)}</div>
                <div className="flex-1">
                  <p className="text-foreground whitespace-pre-wrap">{note.text}</p>
                  <p className="text-xs text-muted-foreground mt-2">{note.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        
        {notes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">💭</div>
            <p>No notes yet. Start capturing your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickNotes;
