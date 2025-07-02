
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Calendar, Wrench, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';

const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tools', icon: Wrench, label: 'Tools' },
    { path: '/timelines', icon: Target, label: 'Timelines' },
    { path: '/habits', icon: Calendar, label: 'Habits' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card-intense border-b border-white/10 md:relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="text-2xl font-black gradient-text tracking-tight">
            OperatorOS
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-200 font-medium ${
                  location.pathname === path
                    ? 'bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Sign Out */}
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="hidden md:flex text-slate-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent px-6 py-3 rounded-2xl font-medium transition-all duration-200"
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-card-intense border-t border-white/10">
        <div className="flex justify-around py-4">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-2 px-4 py-2 rounded-2xl transition-all duration-200 ${
                location.pathname === path
                  ? 'text-blue-300 bg-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
