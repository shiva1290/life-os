
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Calendar, Wrench, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';

const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tools', icon: Wrench, label: 'Tools' },
    { path: '/timelines', icon: Target, label: 'Timelines' },
    { path: '/habits', icon: Calendar, label: 'Habits' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card-intense border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center py-4 md:py-6">
            {/* Logo */}
            <div className="text-xl md:text-2xl font-black gradient-text tracking-tight">
              OperatorOS
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                    location.pathname === path
                      ? 'bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Sign Out */}
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="hidden md:flex text-slate-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm"
            >
              <LogOut size={16} className="mr-1" />
              Sign Out
            </Button>

            {/* Mobile Menu Button */}
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              className="md:hidden text-slate-300 hover:text-white hover:bg-white/5 border border-transparent px-2 py-2 rounded-xl"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-card-intense border-b border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col p-3 space-y-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                    location.pathname === path
                      ? 'bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="flex items-center justify-start space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent font-medium transition-all duration-200 text-sm"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navigation;
