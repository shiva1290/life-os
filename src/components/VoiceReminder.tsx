
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';

const VoiceReminder = () => {
  const { getCurrentBlock } = useOperatorSystem();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    return localStorage.getItem('voiceReminders') === 'true';
  });
  const [lastAnnouncedBlock, setLastAnnouncedBlock] = useState<string | null>(null);

  const currentBlock = getCurrentBlock();

  useEffect(() => {
    localStorage.setItem('voiceReminders', isVoiceEnabled.toString());
  }, [isVoiceEnabled]);

  useEffect(() => {
    if (isVoiceEnabled && currentBlock && currentBlock.id !== lastAnnouncedBlock) {
      announceBlock(currentBlock);
      setLastAnnouncedBlock(currentBlock.id);
    }
  }, [currentBlock, isVoiceEnabled, lastAnnouncedBlock]);

  const announceBlock = (block: any) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `It's ${block.time_slot.split('-')[0]}. Time to dominate ${block.task} — let's go.`
    );
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.7;
    
    // Use a more professional voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Microsoft')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
      className={`fixed bottom-4 right-4 z-40 rounded-full w-12 h-12 p-0 transition-all duration-300 ${
        isVoiceEnabled 
          ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
          : 'bg-white/10 text-white/60 hover:bg-white/20'
      }`}
      title={isVoiceEnabled ? 'Disable voice reminders' : 'Enable voice reminders'}
    >
      {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </Button>
  );
};

export default VoiceReminder;
