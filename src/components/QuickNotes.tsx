
import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const QuickNotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!user || !newNoteContent.trim()) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          content: newNoteContent,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data, ...prev.slice(0, 4)]);
      setNewNoteContent('');
      setIsAddingNote(false);
      
      toast({
        title: "Success!",
        description: "Note added successfully",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(prev => prev.filter(n => n.id !== id));
      
      toast({
        title: "Success!",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
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
            <StickyNote className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">📝 Quick Notes</h3>
              <p className="text-sm text-white/70">Capture your thoughts</p>
            </div>
          </div>
          <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Quick Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your note here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white min-h-[120px]"
                />
                <Button onClick={addNote} className="w-full bg-yellow-600 hover:bg-yellow-700">
                  Add Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-white text-sm leading-relaxed">{note.content}</p>
                  <p className="text-xs text-white/50 mt-2">
                    {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  className="text-red-400 hover:text-red-300 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <StickyNote className="w-12 h-12 mx-auto mb-4" />
              <p>No notes yet. Add your first note to capture ideas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickNotes;
