
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';

interface FocusSession {
  id: string;
  session_type: string;
  duration_minutes: number;
  completed: boolean;
  created_at: string;
}

const FocusTimer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [selectedDuration, setSelectedDuration] = useState('25');
  const [sessionType, setSessionType] = useState('study');
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    if (user) {
      fetchTodaysSessions();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const fetchTodaysSessions = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .gte('created_at', today)
        .lt('created_at', new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSessionComplete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('focus_sessions')
        .insert([{
          user_id: user.id,
          session_type: sessionType,
          duration_minutes: parseInt(selectedDuration),
          completed: true
        }]);

      if (error) throw error;
      
      toast({
        title: "🎯 Focus session completed!",
        description: `Great work on your ${sessionType} session!`,
      });
      
      fetchTodaysSessions();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(parseInt(selectedDuration) * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionTypeEmoji = (type: string) => {
    switch (type) {
      case 'study': return '📚';
      case 'dsa': return '💻';
      case 'dev': return '⚡';
      case 'reading': return '📖';
      default: return '🎯';
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🎯 Focus Timer</h3>
            <p className="text-sm text-white/70">Deep work sessions</p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-mono font-bold mb-4 transition-colors duration-300 ${
            isRunning ? 'text-green-400' : 'text-white'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex gap-3 justify-center mb-4">
            <Button
              onClick={isRunning ? pauseTimer : startTimer}
              className={`px-6 py-3 ${
                isRunning 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="px-6 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Duration</label>
            <Select value={selectedDuration} onValueChange={(value) => {
              setSelectedDuration(value);
              if (!isRunning) {
                setTimeLeft(parseInt(value) * 60);
              }
            }}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-white/70 mb-2 block">Session Type</label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study">📚 Study</SelectItem>
                <SelectItem value="dsa">💻 DSA</SelectItem>
                <SelectItem value="dev">⚡ Development</SelectItem>
                <SelectItem value="reading">📖 Reading</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-semibold text-white/80 mb-3">Today's Sessions</h4>
          <div className="grid grid-cols-4 gap-2">
            {sessions.slice(0, 8).map((session, index) => (
              <div
                key={session.id}
                className="text-center p-2 bg-white/5 rounded-lg"
                title={`${session.session_type} - ${session.duration_minutes}min`}
              >
                <div className="text-lg">{getSessionTypeEmoji(session.session_type)}</div>
                <div className="text-xs text-white/60">{session.duration_minutes}m</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <span className="text-2xl font-bold text-purple-400">{sessions.length}</span>
            <span className="text-sm text-white/60 ml-2">sessions today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
