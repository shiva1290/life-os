
import React from 'react';

interface Milestone {
  month: number;
  title: string;
  changes: string[];
  visibleResult: string;
  mentalShift: string;
}

const FitnessTimeline = () => {
  const milestones: Milestone[] = [
    {
      month: 3,
      title: 'Month 3 (Oct 2025)',
      changes: [
        'Strength gains (neurological)',
        'Posture improves',
        'Slight shape in shoulders & arms',
        'Lower belly still there'
      ],
      visibleResult: 'Fit from certain angles. "Are you going to the gym?" comments begin.',
      mentalShift: 'Gym becomes dopamine source. Identity begins to shift.'
    },
    {
      month: 6,
      title: 'Month 6 (Jan 2026)',
      changes: [
        '+3–4 kg muscle, -2–3 kg fat (recomp)',
        'V-taper begins, triceps & shoulders visible',
        'Belly flatter'
      ],
      visibleResult: 'T-shirts fit better. People now notice body change.',
      mentalShift: '"I look good" → Confidence up. You feel like a gym guy.'
    },
    {
      month: 12,
      title: 'Month 12 (July 2026)',
      changes: [
        '+5–6 kg muscle total',
        'Abs faintly visible (if cut)',
        'Arms fill out, lats & traps show',
        'Gym = identity'
      ],
      visibleResult: 'You look strong. Girls and bros both notice. You feel proud shirtless.',
      mentalShift: 'Shame gone. Gym is therapy. Focus improved. You\'re confident in body + mind.'
    },
    {
      month: 24,
      title: 'Month 24 (July 2027 — Graduation)',
      changes: [
        '+7–9 kg muscle, ~10–12% body fat (if cut)',
        'Muscle separation visible (delts, chest, arms, abs)',
        'Arms 15"+, legs strong, balanced physique'
      ],
      visibleResult: 'Complete transformation. You look like you\'ve trained for 2 years. Top 5% body in your age group.',
      mentalShift: 'Total control over your body = permanent confidence. You now live like a man in control.'
    }
  ];

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-2">Fitness Transformation Timeline</h2>
        <p className="text-muted-foreground">From skinny-fat to aesthetic and confident</p>
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
                <h3 className="text-lg font-bold text-primary">{milestone.title}</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-400">Physical Changes</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {milestone.changes.map((change, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-400">Visible Result</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{milestone.visibleResult}"
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-400">Mental Shift</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{milestone.mentalShift}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-2 text-primary">Required Discipline</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>• 6x/week gym (Push Pull Legs x2)</div>
          <div>• 7+ hrs sleep consistently</div>
          <div>• 120–140g protein daily</div>
          <div>• ₹9000/month vegetarian diet</div>
          <div>• Minimal junk, controlled cheats</div>
          <div>• Track lifts & monthly photos</div>
        </div>
      </div>
    </div>
  );
};

export default FitnessTimeline;
