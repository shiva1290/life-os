import React from 'react';
import { Button } from '@/components/ui/button';
import { useGuestMode } from '@/hooks/useGuestMode';
import { Eye, User, LogIn, Target, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Landing = () => {
  const { setGuestMode } = useGuestMode();

  const handleGuestMode = () => {
    setGuestMode(true);
    // Navigate to dashboard after enabling guest mode
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white">
      {/* Fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black -z-10" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 -z-10" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black gradient-text mb-4 tracking-tight">
              LifeOS
            </h1>
            <p className="text-xl md:text-3xl text-slate-300 font-medium mb-2">
              Execute with precision. Track with purpose.
            </p>
            <p className="text-lg text-slate-400">
              The ultimate productivity system for high achievers
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold text-white mb-2">Live Timeline</h3>
              <p className="text-sm text-slate-400">Track your daily blocks in real-time with smart scheduling</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <Target className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold text-white mb-2">Habit Tracking</h3>
              <p className="text-sm text-slate-400">Build consistency with streak tracking and habit analytics</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-bold text-white mb-2">Progress Analytics</h3>
              <p className="text-sm text-slate-400">Monitor your weekly performance with detailed insights</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg text-slate-300 mb-4">
                Ready to transform your productivity?
              </p>
            </div>

            {/* Primary CTA - Glimpse */}
            <Button
              onClick={handleGuestMode}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 mb-6"
            >
              <Eye className="w-6 h-6 mr-3" />
              Want to have a glimpse?
            </Button>

            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth?mode=signup">
                <Button
                  variant="outline"
                  className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all w-full sm:w-auto"
                >
                  <User className="w-5 h-5 mr-2" />
                  Create Your Own
                </Button>
              </Link>
              
              <Link to="/auth">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all w-full sm:w-auto"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500">
              No signup required for the demo. Experience the full power of LifeOS instantly.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing; 