import React from 'react';
import { X, UserPlus, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useNavigate } from 'react-router-dom';

interface GuestModePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const GuestModePopup = ({ 
  isOpen, 
  onClose, 
  title = "Like what you see?", 
  message = "Create your own account to save your progress and unlock all features!"
}: GuestModePopupProps) => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    onClose();
    navigate('/auth?mode=signup');
  };

  const handleBrowseMore = () => {
    onClose();
    // User can continue browsing in guest mode
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-white/80 leading-relaxed">{message}</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleCreateAccount}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Your Own Account
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleBrowseMore}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Eye className="w-5 h-5 mr-2" />
              Continue Browsing
            </Button>
          </div>

          <p className="text-xs text-white/50 text-center mt-4">
            Free forever • No credit card required
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestModePopup; 