
import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useOperatorSystem } from '@/hooks/useOperatorSystem';

interface SlipRecoveryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToNext: () => void;
}

const SlipRecoveryOverlay = ({ isOpen, onClose, onJumpToNext }: SlipRecoveryOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`glass-card rounded-3xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-6 animate-pulse">⚡</div>
          <h2 className="text-2xl font-bold text-white mb-4 gradient-text">
            You slipped. But it's not over.
          </h2>
          <p className="text-xl text-white/80 mb-8 font-medium">
            Operators course correct.
          </p>
          
          <Button
            onClick={onJumpToNext}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Jump into the next block now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlipRecoveryOverlay;
