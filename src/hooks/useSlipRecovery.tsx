
import { useState, useEffect, useCallback } from 'react';
import { useOperatorSystem } from './useOperatorSystem';
import { parseTimeSlot, getCurrentTimeInMinutes } from '@/utils/timeHelpers';

export const useSlipRecovery = () => {
  const { dailyBlocks, getCurrentBlock } = useOperatorSystem();
  const [showSlipRecovery, setShowSlipRecovery] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<number>(getCurrentTimeInMinutes());

  const checkForSlips = useCallback(() => {
    try {
      const currentMinutes = getCurrentTimeInMinutes();
      
      // Only check if we've moved forward in time significantly (at least 2 minutes)
      if (currentMinutes - lastCheckedTime < 2) return;
      
      const missedBlocks = dailyBlocks.filter(block => {
        if (block.completed) return false;
        
        const timeSlot = parseTimeSlot(block.time_slot);
        if (!timeSlot) return false;
        
        // Block is missed if current time is past its end time and it was supposed to happen since last check
        return currentMinutes > timeSlot.end && 
               timeSlot.end > lastCheckedTime &&
               currentMinutes - timeSlot.end < 120; // Only show for blocks missed within last 2 hours
      });

      if (missedBlocks.length > 0 && !showSlipRecovery) {
        setShowSlipRecovery(true);
      }
      
      setLastCheckedTime(currentMinutes);
    } catch (error) {
      console.error('Error checking for slips:', error);
    }
  }, [dailyBlocks, lastCheckedTime, showSlipRecovery]);

  useEffect(() => {
    const interval = setInterval(checkForSlips, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkForSlips]);

  const handleJumpToNext = useCallback(() => {
    const currentBlock = getCurrentBlock();
    if (currentBlock) {
      const element = document.getElementById(`block-${currentBlock.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    setShowSlipRecovery(false);
  }, [getCurrentBlock]);

  const handleDismissSlip = useCallback(() => {
    setShowSlipRecovery(false);
  }, []);

  return {
    showSlipRecovery,
    setShowSlipRecovery,
    handleJumpToNext,
    handleDismissSlip
  };
};
