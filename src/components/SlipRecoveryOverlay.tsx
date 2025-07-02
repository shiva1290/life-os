
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`glass-card rounded-3xl p-6 md:p-8 max-w-md w-full transform transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-white h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-4xl md:text-6xl mb-6 animate-pulse">⚡</div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 gradient-text">
            You slipped. But it's not over.
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 font-medium">
            Operators course correct.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={onJumpToNext}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Jump to next block
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 md:px-8 py-2 md:py-3 rounded-2xl font-medium text-sm md:text-base"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              I'll catch up later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlipRecoveryOverlay;
