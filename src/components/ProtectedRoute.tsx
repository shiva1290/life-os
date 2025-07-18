
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { isGuestMode, setGuestMode } = useGuestMode();

  // Disable guest mode when real user signs in
  useEffect(() => {
    if (user && isGuestMode) {
      setGuestMode(false);
    }
  }, [user, isGuestMode, setGuestMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-white mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuestMode) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
