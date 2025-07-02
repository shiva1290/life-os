
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';

const VoiceReminder = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('voiceReminders') === 'true';
  });
  const [lastAnnouncedBlock, setLastAnnouncedBlock] = useState<string | null>(null);
  const { getCurrentBlock } = useOperatorSystem();

  useEffect(() => {
    localStorage.setItem('voiceReminders', isEnabled.toString());
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled || !('speechSynthesis' in window)) return;

    const currentBlock = getCurrentBlock();
    if (!currentBlock || currentBlock.id === lastAnnouncedBlock) return;

    const timeSlot = currentBlock.time_slot.split('-')[0];
    const message = `It's ${timeSlot}. Time to ${currentBlock.task}. Let's go.`;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.volume = 0.7;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Use a more natural voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.includes('en-US')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
    setLastAnnouncedBlock(currentBlock.id);
  }, [getCurrentBlock(), isEnabled, lastAnnouncedBlock]);

  if (!('speechSynthesis' in window)) {
    return null; // Don't show if speech synthesis isn't supported
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button
        onClick={() => setIsEnabled(!isEnabled)}
        variant="outline"
        size="sm"
        className={`
          backdrop-blur-xl border transition-all duration-300 rounded-xl h-10 w-10 p-0
          ${isEnabled 
            ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30' 
            : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
          }
        `}
        title={isEnabled ? 'Voice reminders ON' : 'Voice reminders OFF'}
      >
        {isEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default VoiceReminder;
