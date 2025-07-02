
import React, { useState } from 'react';
import { StickyNote, Plus, Archive, Calendar } from 'lucide-react';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';

const QuickNotes = () => {
  const { notes, addNote, loading } = useSupabaseSync();
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    await addNote(newNote.trim());
    setNewNote('');
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <StickyNote className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Quick Notes</h3>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Archive className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Jot down a quick note..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <button
            onClick={handleAddNote}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <p className="text-white text-sm">{note.content}</p>
            <div className="flex items-center gap-1 mt-2 text-white/50 text-xs">
              <Calendar size={12} />
              {new Date(note.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
        
        {notes.length === 0 && (
          <div className="text-center py-8 text-white/60">
            <div className="text-4xl mb-2">📝</div>
            <p>No notes yet. Add your first thought above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickNotes;
