import React from 'react';
import { Heart, Github, Twitter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Left side - Branding */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-sm sm:text-base font-bold text-white">Life OS</div>
              <div className="text-xs sm:text-sm text-white/60">Your Personal Operating System</div>
            </div>
          </div>

          {/* Center - Navigation Links (hidden on mobile, shown on sm+) */}
          <div className="hidden sm:flex items-center gap-6 text-sm text-white/70">
            <Link 
              to="/dashboard" 
              className="hover:text-white transition-colors duration-200 py-2"
              aria-label="Go to Dashboard"
            >
              Dashboard
            </Link>
            <Link 
              to="/timelines" 
              className="hover:text-white transition-colors duration-200 py-2"
              aria-label="Go to Timelines"
            >
              Timelines
            </Link>
            <Link 
              to="/habits" 
              className="hover:text-white transition-colors duration-200 py-2"
              aria-label="Go to Habits"
            >
              Habits
            </Link>
          </div>

          {/* Right side - Attribution */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-right">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
              <span>Made by Shiva</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 animate-pulse" />
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/shiva1290"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group"
                aria-label="View on GitHub"
              >
                <Github className="w-4 h-4 text-white/70 group-hover:text-white" />
              </a>
              <a
                href="https://x.com/ashandtide"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 group"
                aria-label="Follow on X"
              >
                <Twitter className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile-only navigation links */}
        <div className="sm:hidden mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-center gap-6 text-sm text-white/70">
            <Link 
              to="/dashboard" 
              className="hover:text-white transition-colors duration-200 py-2 px-3"
              aria-label="Go to Dashboard"
            >
              Dashboard
            </Link>
            <Link 
              to="/timelines" 
              className="hover:text-white transition-colors duration-200 py-2 px-3"
              aria-label="Go to Timelines"
            >
              Timelines
            </Link>
            <Link 
              to="/habits" 
              className="hover:text-white transition-colors duration-200 py-2 px-3"
              aria-label="Go to Habits"
            >
              Habits
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 sm:mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs sm:text-sm text-white/50">
            © {new Date().getFullYear()} Life OS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 