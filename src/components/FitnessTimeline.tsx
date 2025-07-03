import React, { useState, useEffect } from 'react';
import { useGuestMode } from '@/hooks/useGuestMode';
import { useAuth } from '@/hooks/useAuth';
import { Edit3, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface Milestone {
  id: string;
  month: number;
  title: string;
  changes: string[];
  visibleResult: string;
  mentalShift: string;
}

const FitnessTimeline = () => {
  const { isGuestMode } = useGuestMode();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const getDefaultMilestones = (): Milestone[] => [
    {
      id: '1',
      month: 1,
      title: 'Month 1 - Foundation',
      changes: [
        'Start consistent workout routine',
        'Learn proper form and technique', 
        'Build the exercise habit',
        'Establish baseline measurements'
      ],
      visibleResult: 'Building momentum, people notice your commitment',
      mentalShift: 'Taking the first steps toward transformation'
    },
    {
      id: '3', 
      month: 3,
      title: 'Month 3 - Early Progress',
      changes: [
        'Strength gains become noticeable',
        'Better posture and energy',
        'Slight muscle definition appearing',
        'Workout routine feels natural'
      ],
      visibleResult: 'Friends start commenting on changes',
      mentalShift: 'Confidence growing, gym becomes enjoyable'
    },
    {
      id: '6',
      month: 6,
      title: 'Month 6 - Visible Change',
      changes: [
        'Clear muscle growth visible',
        'Body composition improving',
        'Strength milestones achieved',
        'Fitness identity established'
      ],
      visibleResult: 'Others ask for fitness advice',
      mentalShift: 'Strong body creates strong mindset'
    },
    {
      id: '12',
      month: 12,
      title: 'Month 12 - Transformation',
      changes: [
        'Complete physique transformation',
        'Advanced fitness capabilities',
        'Aesthetic muscle development',
        'Fitness lifestyle fully integrated'
      ],
      visibleResult: 'Inspiration to others, top-tier physique',
      mentalShift: 'Fitness mastery achieved, part of identity'
    }
  ];

  useEffect(() => {
    // Load user's custom milestones from localStorage for now
    // In production, this would come from a database
    const storageKey = isGuestMode ? 'guest_fitness_milestones' : `fitness_milestones_${user?.id}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        setMilestones(JSON.parse(saved));
      } catch {
        setMilestones(getDefaultMilestones());
      }
    } else {
      setMilestones(getDefaultMilestones());
    }
  }, [isGuestMode, user]);

  const saveMilestones = (newMilestones: Milestone[]) => {
    setMilestones(newMilestones);
    const storageKey = isGuestMode ? 'guest_fitness_milestones' : `fitness_milestones_${user?.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newMilestones));
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    const updated = milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    saveMilestones(updated);
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      month: Math.max(...milestones.map(m => m.month)) + 1,
      title: `Month ${Math.max(...milestones.map(m => m.month)) + 1} - New Goal`,
      changes: ['Add your fitness changes here'],
      visibleResult: 'Describe the visible results',
      mentalShift: 'Describe the mental transformation'
    };
    saveMilestones([...milestones, newMilestone]);
  };

  const deleteMilestone = (id: string) => {
    saveMilestones(milestones.filter(m => m.id !== id));
  };

  const addChange = (milestoneId: string) => {
    updateMilestone(milestoneId, 'changes', [...milestones.find(m => m.id === milestoneId)!.changes, 'New change']);
  };

  const updateChange = (milestoneId: string, changeIndex: number, value: string) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    const newChanges = [...milestone.changes];
    newChanges[changeIndex] = value;
    updateMilestone(milestoneId, 'changes', newChanges);
  };

  const removeChange = (milestoneId: string, changeIndex: number) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    const newChanges = milestone.changes.filter((_, i) => i !== changeIndex);
    updateMilestone(milestoneId, 'changes', newChanges);
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl font-bold gradient-text">Fitness Transformation Timeline</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-white/70 hover:text-white"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-muted-foreground">
          {isEditing ? 'Click to edit your personalized fitness journey' : 'Your personalized path to fitness transformation'}
        </p>
      </div>

      <div className="space-y-6">
        {milestones.sort((a, b) => a.month - b.month).map((milestone, index) => (
          <div key={milestone.id} className="relative">
            {index < milestones.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-primary to-transparent" />
            )}
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {isEditing ? (
                  <Input
                    type="number"
                    value={milestone.month}
                    onChange={(e) => updateMilestone(milestone.id, 'month', parseInt(e.target.value) || 1)}
                    className="w-8 h-8 text-center bg-transparent border-none text-white text-sm p-0"
                    min="1"
                  />
                ) : (
                  milestone.month
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      className="text-lg font-bold text-primary bg-white/5 border-white/20"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-primary">{milestone.title}</h3>
                  )}
                  
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMilestone(milestone.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-400">Physical Changes</h4>
                    <div className="space-y-1">
                      {milestone.changes.map((change, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          {isEditing ? (
                            <div className="flex-1 flex gap-1">
                              <Input
                                value={change}
                                onChange={(e) => updateChange(milestone.id, idx, e.target.value)}
                                className="text-sm bg-white/5 border-white/20"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeChange(milestone.id, idx)}
                                className="text-red-400 hover:text-red-300 px-2"
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">{change}</span>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addChange(milestone.id)}
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add change
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-400">Visible Result</h4>
                    {isEditing ? (
                      <Textarea
                        value={milestone.visibleResult}
                        onChange={(e) => updateMilestone(milestone.id, 'visibleResult', e.target.value)}
                        className="text-sm bg-white/5 border-white/20 min-h-[60px]"
                        placeholder="What will people notice?"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        "{milestone.visibleResult}"
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-400">Mental Shift</h4>
                    {isEditing ? (
                      <Textarea
                        value={milestone.mentalShift}
                        onChange={(e) => updateMilestone(milestone.id, 'mentalShift', e.target.value)}
                        className="text-sm bg-white/5 border-white/20 min-h-[60px]"
                        placeholder="How will you feel mentally?"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        "{milestone.mentalShift}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={addMilestone}
            className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      )}

      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-2 text-primary">💡 Success Tips</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>• Consistency beats intensity</div>
          <div>• Track your progress with photos</div>
          <div>• Focus on compound movements</div>
          <div>• Prioritize adequate sleep</div>
          <div>• Maintain proper nutrition</div>
          <div>• Celebrate small wins</div>
        </div>
      </div>
    </div>
  );
};

export default FitnessTimeline;
