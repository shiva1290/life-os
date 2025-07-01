
import React, { useState, useEffect } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface GoalCategory {
  title: string;
  emoji: string;
  color: string;
  goals: Goal[];
}

const GoalSection = () => {
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([
    {
      title: 'CAREER',
      emoji: '💼',
      color: 'from-blue-500 to-cyan-500',
      goals: [
        { id: 'career-1', title: 'Crack 12+ LPA Job', description: 'Tier 1 Product Startup or Remote', completed: false },
        { id: 'career-2', title: 'Master DSA', description: 'Complete Striver + TUF curriculum', completed: false },
        { id: 'career-3', title: 'Build 2-3 Projects', description: 'MERN + AI full-stack applications', completed: false },
        { id: 'career-4', title: 'Professional Presence', description: 'Sharp resume + GitHub + LinkedIn', completed: false },
      ]
    },
    {
      title: 'HEALTH',
      emoji: '💪',
      color: 'from-green-500 to-emerald-500',
      goals: [
        { id: 'health-1', title: 'Fix Skinny Fat', description: 'Get lean and build muscle mass', completed: false },
        { id: 'health-2', title: 'Gym Consistency', description: '6x/week morning workouts', completed: false },
        { id: 'health-3', title: 'Nutrition Plan', description: '₹9000/month vegetarian diet with protein', completed: false },
        { id: 'health-4', title: 'Sleep Schedule', description: '7+ hours consistent sleep', completed: false },
      ]
    },
    {
      title: 'MENTAL',
      emoji: '🧠',
      color: 'from-purple-500 to-pink-500',
      goals: [
        { id: 'mental-1', title: 'ADHD Management', description: 'Structure + dopamine discipline', completed: false },
        { id: 'mental-2', title: 'Daily Structure', description: 'Consistent routines and rituals', completed: false },
        { id: 'mental-3', title: 'Reflection Practice', description: 'Daily self-assessment and planning', completed: false },
        { id: 'mental-4', title: 'Focus Mastery', description: 'Eliminate distractions and stay present', completed: false },
      ]
    },
    {
      title: 'SPIRITUAL',
      emoji: '🙏',
      color: 'from-orange-500 to-red-500',
      goals: [
        { id: 'spiritual-1', title: 'Daily Prayer', description: '2+ minutes morning and night', completed: false },
        { id: 'spiritual-2', title: 'Faith Practice', description: 'Trust the path + karma mindset', completed: false },
        { id: 'spiritual-3', title: 'Discipline as Worship', description: 'Every action with intention', completed: false },
        { id: 'spiritual-4', title: 'Gratitude Practice', description: 'Daily appreciation and reflection', completed: false },
      ]
    }
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lifeOS-goals');
    if (saved) {
      setGoalCategories(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('lifeOS-goals', JSON.stringify(goalCategories));
  }, [goalCategories]);

  const toggleGoal = (categoryIndex: number, goalId: string) => {
    setGoalCategories(prev => 
      prev.map((category, idx) => 
        idx === categoryIndex 
          ? {
              ...category,
              goals: category.goals.map(goal => 
                goal.id === goalId 
                  ? { ...goal, completed: !goal.completed }
                  : goal
              )
            }
          : category
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">Life Goals</h2>
        <p className="text-muted-foreground">Your path to becoming an execution machine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goalCategories.map((category, categoryIndex) => {
          const completedCount = category.goals.filter(g => g.completed).length;
          const progressPercentage = (completedCount / category.goals.length) * 100;
          
          return (
            <div key={category.title} className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.emoji}</span>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {completedCount}/{category.goals.length}
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${category.color} transition-all duration-300`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {category.goals.map((goal) => (
                  <div key={goal.id} className="flex items-start space-x-3 group">
                    <button
                      onClick={() => toggleGoal(categoryIndex, goal.id)}
                      className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                        goal.completed 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground hover:border-primary'
                      }`}
                    >
                      {goal.completed && (
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {goal.title}
                      </h4>
                      <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {goal.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalSection;
