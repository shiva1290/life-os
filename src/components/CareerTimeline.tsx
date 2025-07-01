
import React from 'react';

interface CareerMilestone {
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
  const milestones: CareerMilestone[] = [
    {
      month: 3,
      title: 'Month 3 (Oct 2025)',
      status: 'Engine is warming up',
      requirements: [
        '100+ DSA problems solved',
        '50% of TUF playlist done',
        '1 mini-project deployed (cohort-based)',
        'Gym routine solid, minor visible body changes',
        'ADHD reduced slightly, but still needs effort',
        'Daily structure in place but still fragile'
      ],
      outcomes: [
        'You start to feel momentum',
        'May clear hackathons/screening rounds for low/mid-tier internships',
        'Confidence up, but no job offers yet — you\'re still mid-grind'
      ],
      mood: 'Damn, I\'m changing. Still far, but I\'m actually becoming who I talk about being.',
      salaryRange: '0–2 LPA (maybe gig)',
      tierLevel: 'Tier 3.5'
    },
    {
      month: 6,
      title: 'Month 6 (Jan 2026)',
      status: 'System hardwired. You\'re now in the top 15–20% zone.',
      requirements: [
        '200–250 Leetcode Qs done (across major topics)',
        'Finished Striver Sheet',
        '1 major project ~90% done with README, video, deploy',
        'Resume updated + GitHub active',
        'Started mock interviews / contests weekly',
        'Muscle tone visible, gym is habit, no longer tiring'
      ],
      outcomes: [
        'Start getting callbacks for internships & remote freelance gigs',
        'You\'re clearing first-rounds at startups, getting DMs from recruiters on LinkedIn',
        'Could bag a 5–8 LPA internship at a decent startup or early product company'
      ],
      mood: 'I\'m no longer faking it. I know real stuff. I\'m dangerous in interviews. Still haven\'t \'arrived\', but now it\'s inevitable.',
      salaryRange: '5–8 LPA',
      tierLevel: 'Tier 3'
    },
    {
      month: 12,
      title: 'Month 12 (July 2026)',
      status: 'You\'re a proper "SDE-1 Ready" candidate. Resume is legit.',
      requirements: [
        '400–500 Leetcode Qs',
        'Both projects done and deployed with advanced features (auth, socket, etc.)',
        'System Design basics understood',
        'Solid resume + portfolio',
        'Mock interviews done regularly',
        'Weekly DSA and dev routine = automatic'
      ],
      outcomes: [
        'You crack your first 10+ LPA offer (startup/product role) — maybe remote',
        'You clear Walmart, Paytm, Groww, or some US-based remote offer (Turing, Arc, Deel etc.)',
        'You are in the top 5–10% of your batch by skillset',
        'If your college has okay placements, you dominate that too'
      ],
      mood: 'I\'m not competing anymore. I\'m choosing what I want. Every week I hear of someone failing what I cleared.',
      salaryRange: '10–12 LPA',
      tierLevel: 'Tier 2.5'
    },
    {
      month: 24,
      title: 'Month 24 (July 2027 — Graduation)',
      status: 'Life-changing outcomes if you kept going.',
      requirements: [
        '600+ problems (including contest experience)',
        'DSA patterns etched into your brain',
        '2–3 resume-ready projects, one open source or AI-augmented',
        'Side income from freelance / remote contract work',
        'Job in hand: 12–18 LPA, Tier 1 startup/product or US remote',
        'Physique: Fit, visible arms/delts, no skinny fat',
        'ADHD effects minimal — controlled via routine',
        'Spiritual calm + habit resilience'
      ],
      outcomes: [
        'You\'re earning 2.5–3x what most of your batch is.',
        'You\'re financially independent.',
        'You could go remote → travel, help family, or start something of your own',
        'Or if you want, go for MS abroad with insane SOP and projects'
      ],
      mood: 'Nobody\'s coming to save me. But I saved myself. I proved everyone wrong — especially the self-doubting version of me.',
      salaryRange: '12–20 LPA',
      tierLevel: 'Tier 1.5 or Remote'
    }
  ];

  const successStories = [
    {
      name: 'Reddit user @anon123',
      journey: 'Did Striver + System Design + 2 React projects',
      outcome: 'From Tier 3 college to Remote US startup @ $25/hr (~20 LPA) after 16 months'
    },
    {
      name: 'Shivani (Tier 3, UP)',
      journey: 'Took Take U Forward + Cohort 2.0',
      outcome: 'Built 2 projects, cracked PhonePe internship, converted to 13 LPA offer'
    },
    {
      name: 'BITS guy, underperformer',
      journey: 'Did Neetcode + open-source + freelance',
      outcome: 'Landed Airbyte + Contract + $1500/month. Took 18 months but became remote-first'
    }
  ];

  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-2">Career Transformation Timeline</h2>
        <p className="text-muted-foreground">From college student to top-tier SDE — if you stick to the plan</p>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.month} className="relative">
            {index < milestones.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-primary to-transparent" />
            )}
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {milestone.month}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-primary">{milestone.title}</h3>
                  <p className="text-sm text-green-400 font-medium">{milestone.status}</p>
                  {milestone.salaryRange && (
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {milestone.salaryRange}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                        {milestone.tierLevel}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-400">Requirements</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {milestone.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">✅</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-400">Realistic Outcomes</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {milestone.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-400">Mindset</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{milestone.mood}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Stories */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold text-primary">💡 Real Success Stories</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {successStories.map((story, index) => (
            <div key={index} className="bg-secondary/50 rounded-lg p-3 sm:p-4 border border-border/50">
              <h4 className="font-semibold text-green-400 mb-2">{story.name}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                {story.journey}
              </p>
              <p className="text-xs sm:text-sm text-blue-400 font-medium">
                → {story.outcome}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TL;DR Summary */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-3 text-primary">🔥 TL;DR: The Bottom Line</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">
            <strong className="text-green-400">3 Months:</strong> You feel change
          </div>
          <div className="text-muted-foreground">
            <strong className="text-blue-400">6 Months:</strong> You can start earning
          </div>
          <div className="text-muted-foreground">
            <strong className="text-orange-400">12 Months:</strong> You're interview-ready for top roles
          </div>
          <div className="text-muted-foreground">
            <strong className="text-purple-400">24 Months:</strong> ₹12–20 LPA job OR printing money from skills
          </div>
        </div>
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm font-medium text-red-400 text-center">
            And it only requires one thing: <strong>Don't drop off. Don't build new systems. Just f*cking execute this one.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerTimeline;
