
import { useState, useEffect } from 'react';
import { useOperatorSystem } from './useOperatorSystem';

export const useSlipRecovery = () => {
  const { dailyBlocks, getCurrentBlock } = useOperatorSystem();
  const [showSlipRecovery, setShowSlipRecovery] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      checkForSlips();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dailyBlocks]);

  const checkForSlips = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Find blocks that should have been completed by now
    const missedBlocks = dailyBlocks.filter(block => {
      if (block.completed) return false;
      
      const [endTime] = block.time_slot.split('-')[1]?.split(':') || [];
      if (!endTime) return false;
      
      const blockEndTime = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1] || '0');
      
      return blockEndTime < currentTime && blockEndTime > (lastCheckedTime.getHours() * 60 + lastCheckedTime.getMinutes());
    });

    if (missedBlocks.length > 0) {
      setShowSlipRecovery(true);
    }
    
    setLastCheckedTime(now);
  };

  const handleJumpToNext = () => {
    const currentBlock = getCurrentBlock();
    if (currentBlock) {
      // Scroll to current block or focus on it
      const element = document.getElementById(`block-${currentBlock.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    setShowSlipRecovery(false);
  };

  return {
    showSlipRecovery,
    setShowSlipRecovery,
    handleJumpToNext
  };
};
