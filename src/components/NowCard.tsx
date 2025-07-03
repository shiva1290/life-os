import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Target, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';

interface TimelineRecommendation {
  type: 'fitness' | 'career';
  priority: 'high' | 'medium' | 'low';
  action: string;
  context: string;
  timeFrame: string;
}

const NowCard = () => {
  const { user } = useAuth();
  const { isGuestMode } = useGuestMode();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentRecommendation, setCurrentRecommendation] = useState<TimelineRecommendation | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate timeline-based recommendations
  useEffect(() => {
    const getTimelineRecommendation = (): TimelineRecommendation => {
      const hour = currentTime.getHours();
      const dayOfWeek = currentTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Morning routine (6-10 AM)
      if (hour >= 6 && hour < 10) {
        if (isWeekend) {
          return {
            type: 'fitness',
            priority: 'high',
            action: 'Morning Workout Session',
            context: 'Weekend mornings are perfect for longer, focused fitness sessions',
            timeFrame: 'Next 60-90 minutes'
          };
        } else {
          return {
            type: 'career',
            priority: 'high', 
            action: 'Deep Work Block - Core Projects',
            context: 'Morning energy is best for complex problem-solving',
            timeFrame: 'Next 2-3 hours'
          };
        }
      }

      // Mid-morning (10 AM - 12 PM)
      if (hour >= 10 && hour < 12) {
        return {
          type: 'career',
          priority: 'medium',
          action: 'Skills Development & Learning',
          context: 'Build technical competencies for career growth',
          timeFrame: 'Next 1-2 hours'
        };
      }

      // Afternoon (12-2 PM)
      if (hour >= 12 && hour < 14) {
        return {
          type: 'fitness',
          priority: 'medium',
          action: 'Active Break & Movement',
          context: 'Combat afternoon sluggishness with physical activity',
          timeFrame: 'Next 30-45 minutes'
        };
      }

      // Late afternoon (2-6 PM)
      if (hour >= 14 && hour < 18) {
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Weekdays
          return {
            type: 'career',
            priority: 'high',
            action: 'Project Execution & Collaboration',
            context: 'Peak collaboration hours for team projects',
            timeFrame: 'Next 2-4 hours'
          };
        } else {
          return {
            type: 'fitness',
            priority: 'medium',
            action: 'Outdoor Activity or Sport',
            context: 'Weekends are ideal for recreational fitness',
            timeFrame: 'Next 1-2 hours'
          };
        }
      }

      // Evening (6-9 PM)
      if (hour >= 18 && hour < 21) {
        return {
          type: 'fitness',
          priority: 'high',
          action: 'Strength Training Session',
          context: 'Evening workout to maintain fitness progression',
          timeFrame: 'Next 60-75 minutes'
        };
      }

      // Night (9 PM - 12 AM)
      if (hour >= 21 && hour < 24) {
        return {
          type: 'career',
          priority: 'low',
          action: 'Learning & Personal Development',
          context: 'Wind down with skill-building or reading',
          timeFrame: 'Next 1-2 hours'
        };
      }

      // Late night/Early morning (12-6 AM)
      return {
        type: 'fitness',
        priority: 'high',
        action: 'Rest & Recovery',
        context: 'Quality sleep is crucial for both fitness and career goals',
        timeFrame: 'Next 6-8 hours'
      };
    };

    setCurrentRecommendation(getTimelineRecommendation());
  }, [currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-white bg-white/10 border-white/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fitness': return Activity;
      case 'career': return Target;
      default: return CheckCircle;
    }
  };

  if (!currentRecommendation) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">⚡ Right Now</h3>
            <p className="text-xs sm:text-sm text-white/70">Timeline-based recommendations</p>
          </div>
        </div>

        {/* Time Display */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2 tracking-tight">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm sm:text-base text-white/70 font-medium">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Current Recommendation */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            {React.createElement(getTypeIcon(currentRecommendation.type), {
              className: "w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0 mt-1"
            })}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {currentRecommendation.action}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(currentRecommendation.priority)}`}>
                  {currentRecommendation.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-sm sm:text-base text-white/80 mb-2">
                {currentRecommendation.context}
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                <Calendar className="w-4 h-4" />
                <span>{currentRecommendation.timeFrame}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-white/60">Focus Type</div>
                <div className="text-sm sm:text-base font-bold text-white capitalize truncate">
                  {currentRecommendation.type}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-white/60">Energy Level</div>
                <div className="text-sm sm:text-base font-bold text-white">
                  {currentTime.getHours() >= 6 && currentTime.getHours() < 12 ? 'Peak' :
                   currentTime.getHours() >= 12 && currentTime.getHours() < 18 ? 'High' :
                   currentTime.getHours() >= 18 && currentTime.getHours() < 22 ? 'Good' : 'Low'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="mt-4 sm:mt-6 pt-4 border-t border-white/10 text-center">
          <div className="text-xs sm:text-sm text-white/60">
            {isGuestMode 
              ? "👋 Guest mode - Sign up to sync your timeline progress!" 
              : `Keep crushing it, ${user?.user_metadata?.full_name || 'Champion'}! 💪`
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowCard;
