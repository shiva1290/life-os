
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalCategory {
  id: string;
  title: string;
  emoji: string;
  color: string;
  goals: Goal[];
  subtasks: Subtask[];
  completed: boolean;
}

const EditableGoalSection = () => {
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([
    {
      id: 'career',
      title: 'CAREER',
      emoji: '💼',
      color: 'from-blue-500 to-cyan-500',
      completed: false,
      goals: [
        { id: 'career-1', title: 'Crack 12+ LPA Job', description: 'Tier 1 Product Startup or Remote', completed: false },
        { id: 'career-2', title: 'Master DSA', description: 'Complete Striver + TUF curriculum', completed: false },
        { id: 'career-3', title: 'Build 2-3 Projects', description: 'MERN + AI full-stack applications', completed: false },
        { id: 'career-4', title: 'Professional Presence', description: 'Sharp resume + GitHub + LinkedIn', completed: false },
      ],
      subtasks: []
    },
    {
      id: 'health',
      title: 'HEALTH',
      emoji: '💪',
      color: 'from-green-500 to-emerald-500',
      completed: false,
      goals: [
        { id: 'health-1', title: 'Fix Skinny Fat', description: 'Get lean and build muscle mass', completed: false },
        { id: 'health-2', title: 'Gym Consistency', description: '6x/week morning workouts', completed: false },
        { id: 'health-3', title: 'Nutrition Plan', description: '₹9000/month vegetarian diet with protein', completed: false },
        { id: 'health-4', title: 'Sleep Schedule', description: '7+ hours consistent sleep', completed: false },
      ],
      subtasks: []
    },
    {
      id: 'mental',
      title: 'MENTAL',
      emoji: '🧠',
      color: 'from-purple-500 to-pink-500',
      completed: false,
      goals: [
        { id: 'mental-1', title: 'ADHD Management', description: 'Structure + dopamine discipline', completed: false },
        { id: 'mental-2', title: 'Daily Structure', description: 'Consistent routines and rituals', completed: false },
        { id: 'mental-3', title: 'Reflection Practice', description: 'Daily self-assessment and planning', completed: false },
        { id: 'mental-4', title: 'Focus Mastery', description: 'Eliminate distractions and stay present', completed: false },
      ],
      subtasks: []
    },
    {
      id: 'spiritual',
      title: 'SPIRITUAL',
      emoji: '🙏',
      color: 'from-orange-500 to-red-500',
      completed: false,
      goals: [
        { id: 'spiritual-1', title: 'Daily Prayer', description: '2+ minutes morning and night', completed: false },
        { id: 'spiritual-2', title: 'Faith Practice', description: 'Trust the path + karma mindset', completed: false },
        { id: 'spiritual-3', title: 'Discipline as Worship', description: 'Every action with intention', completed: false },
        { id: 'spiritual-4', title: 'Gratitude Practice', description: 'Daily appreciation and reflection', completed: false },
      ],
      subtasks: []
    }
  ]);

  const [editingGoal, setEditingGoal] = useState<{ categoryId: string; goalId: string | null }>({ categoryId: '', goalId: null });
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [showAddForm, setShowAddForm] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lifeOS-goals-editable');
    if (saved) {
      setGoalCategories(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('lifeOS-goals-editable', JSON.stringify(goalCategories));
  }, [goalCategories]);

  const toggleCategoryComplete = (categoryId: string) => {
    setGoalCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, completed: !category.completed }
          : category
      )
    );
  };

  const toggleGoal = (categoryId: string, goalId: string) => {
    setGoalCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
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

  const startEditGoal = (categoryId: string, goal: Goal) => {
    setEditingGoal({ categoryId, goalId: goal.id });
    setEditForm({ title: goal.title, description: goal.description });
  };

  const saveGoalEdit = () => {
    if (!editingGoal.goalId) return;
    
    setGoalCategories(prev =>
      prev.map(category =>
        category.id === editingGoal.categoryId
          ? {
              ...category,
              goals: category.goals.map(goal =>
                goal.id === editingGoal.goalId
                  ? { ...goal, ...editForm }
                  : goal
              )
            }
          : category
      )
    );
    
    setEditingGoal({ categoryId: '', goalId: null });
    setEditForm({ title: '', description: '' });
  };

  const deleteGoal = (categoryId: string, goalId: string) => {
    setGoalCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? { ...category, goals: category.goals.filter(goal => goal.id !== goalId) }
          : category
      )
    );
  };

  const addNewGoal = (categoryId: string) => {
    if (!editForm.title) return;
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: editForm.title,
      description: editForm.description,
      completed: false
    };
    
    setGoalCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? { ...category, goals: [...category.goals, newGoal] }
          : category
      )
    );
    
    setEditForm({ title: '', description: '' });
    setShowAddForm(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">Life Goals</h2>
        <p className="text-muted-foreground">Your path to becoming an execution machine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goalCategories.map((category) => {
          const completedGoalsCount = category.goals.filter(g => g.completed).length;
          const progressPercentage = category.goals.length > 0 ? (completedGoalsCount / category.goals.length) * 100 : 0;
          
          return (
            <div key={category.id} className="glass-card p-6 rounded-xl">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleCategoryComplete(category.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      category.completed 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {category.completed && (
                      <svg className="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className="text-2xl">{category.emoji}</span>
                  <h3 className={`text-xl font-bold ${category.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {category.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {completedGoalsCount}/{category.goals.length}
                  </div>
                  <button
                    onClick={() => setShowAddForm(category.id)}
                    className="p-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${category.color} transition-all duration-300`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Add New Goal Form */}
              {showAddForm === category.id && (
                <div className="mb-4 p-3 bg-secondary/50 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Goal title"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Goal description"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addNewGoal(category.id)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      <Save size={14} />
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(null)}
                      className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Goals List */}
              <div className="space-y-3">
                {category.goals.map((goal) => {
                  const isEditing = editingGoal.categoryId === category.id && editingGoal.goalId === goal.id;
                  
                  return (
                    <div key={goal.id} className="flex items-start space-x-3 group">
                      {isEditing ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                          />
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveGoalEdit}
                              className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                            >
                              <Save size={14} />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingGoal({ categoryId: '', goalId: null })}
                              className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors flex items-center gap-1"
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleGoal(category.id, goal.id)}
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
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                            <button
                              onClick={() => startEditGoal(category.id, goal)}
                              className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => deleteGoal(category.id, goal.id)}
                              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditableGoalSection;
