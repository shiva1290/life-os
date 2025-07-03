import React, { useState, useEffect } from 'react';
import { useGuestMode } from '@/hooks/useGuestMode';
import { useAuth } from '@/hooks/useAuth';
import { Edit3, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface CareerMilestone {
  id: string;
  month: number;
  title: string;
  status: string;
  requirements: string[];
  outcomes: string[];
  mood: string;
  salaryRange?: string;
  tierLevel?: string;
}

const CareerTimeline = () => {
  const { isGuestMode } = useGuestMode();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [milestones, setMilestones] = useState<CareerMilestone[]>([]);

  const getDefaultMilestones = (): CareerMilestone[] => [
    {
      id: '1',
      month: 1,
      title: 'Month 1 - Foundation',
      status: 'Building fundamentals',
      requirements: [
        'Learn programming fundamentals',
        'Set up development environment',
        'Start building first projects',
        'Establish daily coding routine',
        'Join developer communities'
      ],
      outcomes: [
        'Solid understanding of chosen tech stack',
        'First portfolio project deployed',
        'Basic problem-solving skills developed'
      ],
      mood: 'The journey begins. Every day brings new learning.',
      salaryRange: '0-2 LPA',
      tierLevel: 'Learning Phase'
    },
    {
      id: '6',
      month: 6,
      title: 'Month 6 - Skill Building',
      status: 'Gaining momentum',
      requirements: [
        '100+ coding problems solved',
        '2-3 full projects completed',
        'Understanding of algorithms and data structures',
        'Contributing to open source',
        'Building professional network'
      ],
      outcomes: [
        'Landing first internship opportunities',
        'Getting interview callbacks',
        'Building credible online presence'
      ],
      mood: 'Progress is visible. People are starting to notice my work.',
      salaryRange: '4-8 LPA',
      tierLevel: 'Junior Level'
    },
    {
      id: '12',
      month: 12,
      title: 'Month 12 - Job Ready',
      status: 'Interview-ready candidate',
      requirements: [
        '300+ problems solved across topics',
        'Advanced full-stack applications',
        'System design basics understood',
        'Strong GitHub profile',
        'Interview skills polished'
      ],
      outcomes: [
        'Multiple job offers in hand',
        'Ability to negotiate salary',
        'Choice of companies and roles'
      ],
      mood: 'I\'m not job hunting anymore, opportunities find me.',
      salaryRange: '8-15 LPA',
      tierLevel: 'Mid Level'
    },
    {
      id: '24',
      month: 24,
      title: 'Month 24 - Senior Developer',
      status: 'Industry-ready professional',
      requirements: [
        'Expert-level problem solving',
        'Leadership and mentoring skills',
        'Deep specialization in chosen domain',
        'Advanced system design knowledge',
        'Industry recognition achieved'
      ],
      outcomes: [
        'Senior positions or tech lead roles',
        'Remote work opportunities',
        'Financial independence reached'
      ],
      mood: 'I\'ve become the developer I always aspired to be.',
      salaryRange: '15-30 LPA',
      tierLevel: 'Senior Level'
    }
  ];

  useEffect(() => {
    // Load user's custom milestones from localStorage for now
    // In production, this would come from a database
    const storageKey = isGuestMode ? 'guest_career_milestones' : `career_milestones_${user?.id}`;
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

  const saveMilestones = (newMilestones: CareerMilestone[]) => {
    setMilestones(newMilestones);
    const storageKey = isGuestMode ? 'guest_career_milestones' : `career_milestones_${user?.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newMilestones));
  };

  const updateMilestone = (id: string, field: keyof CareerMilestone, value: any) => {
    const updated = milestones.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    saveMilestones(updated);
  };

  const addMilestone = () => {
    const newMilestone: CareerMilestone = {
      id: Date.now().toString(),
      month: Math.max(...milestones.map(m => m.month)) + 6,
      title: `Month ${Math.max(...milestones.map(m => m.month)) + 6} - New Goal`,
      status: 'Describe your status',
      requirements: ['Add your requirements here'],
      outcomes: ['Add expected outcomes here'],
      mood: 'Describe how you\'ll feel',
      salaryRange: 'Expected salary range',
      tierLevel: 'Career level'
    };
    saveMilestones([...milestones, newMilestone]);
  };

  const deleteMilestone = (id: string) => {
    saveMilestones(milestones.filter(m => m.id !== id));
  };

  const addRequirement = (milestoneId: string) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    updateMilestone(milestoneId, 'requirements', [...milestone.requirements, 'New requirement']);
  };

  const updateRequirement = (milestoneId: string, index: number, value: string) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    const newRequirements = [...milestone.requirements];
    newRequirements[index] = value;
    updateMilestone(milestoneId, 'requirements', newRequirements);
  };

  const removeRequirement = (milestoneId: string, index: number) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    const newRequirements = milestone.requirements.filter((_, i) => i !== index);
    updateMilestone(milestoneId, 'requirements', newRequirements);
  };

  const addOutcome = (milestoneId: string) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    updateMilestone(milestoneId, 'outcomes', [...milestone.outcomes, 'New outcome']);
  };

  const updateOutcome = (milestoneId: string, index: number, value: string) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    const newOutcomes = [...milestone.outcomes];
    newOutcomes[index] = value;
    updateMilestone(milestoneId, 'outcomes', newOutcomes);
  };

  const removeOutcome = (milestoneId: string, index: number) => {
    const milestone = milestones.find(m => m.id === milestoneId)!;
    const newOutcomes = milestone.outcomes.filter((_, i) => i !== index);
    updateMilestone(milestoneId, 'outcomes', newOutcomes);
  };

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl font-bold gradient-text">Career Transformation Timeline</h2>
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
          {isEditing ? 'Customize your personalized career roadmap' : 'Your personalized path to career success'}
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
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                        className="text-lg font-bold text-primary bg-white/5 border-white/20 mb-2"
                      />
                    ) : (
                      <h3 className="text-lg font-bold text-primary">{milestone.title}</h3>
                    )}
                    
                    {isEditing ? (
                      <Input
                        value={milestone.status}
                        onChange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                        className="text-sm text-green-400 bg-white/5 border-white/20"
                      />
                    ) : (
                      <p className="text-sm text-green-400 font-medium">{milestone.status}</p>
                    )}
                    
                    {(milestone.salaryRange || milestone.tierLevel) && (
                      <div className="flex gap-2 mt-2">
                        {milestone.salaryRange && (
                          isEditing ? (
                            <Input
                              value={milestone.salaryRange}
                              onChange={(e) => updateMilestone(milestone.id, 'salaryRange', e.target.value)}
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                              placeholder="Salary range"
                            />
                          ) : (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                              {milestone.salaryRange}
                            </span>
                          )
                        )}
                        {milestone.tierLevel && (
                          isEditing ? (
                            <Input
                              value={milestone.tierLevel}
                              onChange={(e) => updateMilestone(milestone.id, 'tierLevel', e.target.value)}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                              placeholder="Career level"
                            />
                          ) : (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                              {milestone.tierLevel}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  
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
                    <h4 className="font-semibold text-green-400">Requirements</h4>
                    <div className="space-y-1">
                      {milestone.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">✅</span>
                          {isEditing ? (
                            <div className="flex-1 flex gap-1">
                              <Input
                                value={req}
                                onChange={(e) => updateRequirement(milestone.id, idx, e.target.value)}
                                className="text-sm bg-white/5 border-white/20"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRequirement(milestone.id, idx)}
                                className="text-red-400 hover:text-red-300 px-2"
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">{req}</span>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addRequirement(milestone.id)}
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add requirement
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-400">Expected Outcomes</h4>
                    <div className="space-y-1">
                      {milestone.outcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {isEditing ? (
                            <div className="flex-1 flex gap-1">
                              <Input
                                value={outcome}
                                onChange={(e) => updateOutcome(milestone.id, idx, e.target.value)}
                                className="text-sm bg-white/5 border-white/20"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOutcome(milestone.id, idx)}
                                className="text-red-400 hover:text-red-300 px-2"
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">{outcome}</span>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addOutcome(milestone.id)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add outcome
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-400">Mindset</h4>
                    {isEditing ? (
                      <Textarea
                        value={milestone.mood}
                        onChange={(e) => updateMilestone(milestone.id, 'mood', e.target.value)}
                        className="text-sm bg-white/5 border-white/20 min-h-[60px]"
                        placeholder="How will you feel at this stage?"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        "{milestone.mood}"
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

      {/* Quick Summary */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-3 text-primary">🚀 Quick Roadmap</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">
            <strong className="text-green-400">1-3 Months:</strong> Build foundation
          </div>
          <div className="text-muted-foreground">
            <strong className="text-blue-400">6 Months:</strong> Start earning
          </div>
          <div className="text-muted-foreground">
            <strong className="text-orange-400">12 Months:</strong> Job-ready
          </div>
          <div className="text-muted-foreground">
            <strong className="text-purple-400">24 Months:</strong> Senior opportunities
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm font-medium text-green-400 text-center">
            💡 Success Formula: <strong>Consistency + Practice + Building Real Projects = Career Growth</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerTimeline;
