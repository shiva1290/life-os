
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "See you later!",
      });
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/10">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-medium">{user?.user_metadata?.full_name || 'User'}</p>
          <p className="text-white/70 text-sm">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 transition-colors text-white/70 hover:text-red-400"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default UserProfile;
