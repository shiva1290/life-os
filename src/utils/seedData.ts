
import { supabase } from '@/integrations/supabase/client';

export const seedUserData = async (userId: string) => {
  try {
    console.log('Starting comprehensive data seeding for user:', userId);

    // Sample todos based on your daily system
    const todosData = [
      { text: "Morning prayer and water", priority: "high", category: "personal", completed: true },
      { text: "Gym session (Push/Pull/Legs)", priority: "high", category: "gym", completed: true },
      { text: "TUF DSA Concept video", priority: "high", category: "study", completed: false },
      { text: "Striver Sheet (2-3 problems)", priority: "high", category: "study", completed: false },
      { text: "College classes", priority: "medium", category: "college", completed: true },
      { text: "Amul Protein shake", priority: "medium", category: "personal", completed: true },
      { text: "DSA Revision", priority: "high", category: "study", completed: false },
      { text: "Evening prayer and reflection", priority: "high", category: "personal", completed: false },
      { text: "Weekly plan reset", priority: "medium", category: "personal", completed: false },
      { text: "Resume/LinkedIn update", priority: "medium", category: "study", completed: false },
    ];

    for (const todo of todosData) {
      await supabase.from('todos').insert([{
        ...todo,
        user_id: userId,
      }]);
    }

    // Notes with your comprehensive life strategy
    const notesData = [
      { 
        content: `🎯 PRIMARY LIFE GOALS:
✅ CAREER (TOP PRIORITY)
- Crack 12+ LPA job (Tier 1 Product Startup or Remote)
- Master DSA using Striver + TUF
- Build 2–3 strong MERN + AI full-stack projects
- Build sharp resume + GitHub + LinkedIn presence

✅ HEALTH
- Fix skinny fat, get lean, build muscle
- Gym 6x/week (morning)
- Protein-rich ₹9000/month vegetarian Indian diet

✅ MENTAL
- Minimize ADHD through structure + dopamine discipline
- Daily structure, rituals, and reflection
- 7 hrs sleep no matter what

✅ SPIRITUAL
- Daily prayer + reflection (2 mins min)
- Faith + karma = anchor
- Discipline = your worship` 
      },
      { 
        content: `⚔️ DSA STRATEGY (HIGH PRIORITY):
- Sheet: Striver SDE Sheet ✅
- Concepts: TUF YouTube (Graphs, DP, Trees, Sliding Window) ✅
- 15–20 Qs per week
- Weekly mock contests (LeetCode / InterviewBit / GFG)
- Revise every 5 days
- Maintain notes + flashcards` 
      },
      { 
        content: `🛠️ DEV STRATEGY (WEEKEND PRIORITY):
- Follow Cohort 3.0 only — no extra tutorials
- 2 full-stack projects:
  • NoteAura: Markdown, PDF export, semantic search
  • Grey Shot: Anonymous social media with comment moderation, AI, socket.io
- Host everything on Vercel/Render
- Push GitHub weekly, document with good READMEs` 
      },
      { 
        content: `🏋️ HEALTH STRATEGY:
- Gym: Push-Pull-Legs x2/week
- Sleep: 7 hours minimum
- Diet:
  🥣 Breakfast: Oats + banana/eggs + milk or lassi
  🍛 Lunch (college): Rajma/Chole Chawal + Amul Protein Lassi
  🍎 Evening: Fruit + paneer or peanuts
  🍽️ Dinner: 4 chapati + sabzi + dal + raita
  🧃 1 Amul Protein sachet/day` 
      },
      { 
        content: `🔁 DAILY AFFIRMATION (Read every morning):
I am a high-performing operator. I show up even when I'm tired.
I move with clarity. I pray, I push, I reflect.
My 12 LPA job already exists. I'm just catching up to it.` 
      },
      { 
        content: `❌ AVOID AT ALL COSTS:
- YouTube binging (tutorial hell)
- Instagram scrolling + reels
- Starting new systems every 3 weeks
- All-nighters or sleep breaks
- Motivational overdose
- Skipping gym/study more than 2 days in a row` 
      },
      { 
        content: `🏋️‍♂️ FITNESS TRANSFORMATION TIMELINE:
Month 3 (Oct 2025): Strength gains, posture improves, slight shape in shoulders
Month 6 (Jan 2026): +3-4 kg muscle, V-taper begins, belly flatter
Month 12 (July 2026): +5-6 kg muscle, abs visible, arms fill out
Month 24 (July 2027): Complete transformation, top 5% body` 
      },
    ];

    for (const note of notesData) {
      await supabase.from('notes').insert([{
        ...note,
        user_id: userId,
      }]);
    }

    // Strategic habits based on your system
    const habitsData = [
      { name: "Morning Prayer", icon: "🙏", color: "#10B981", streak: 15 },
      { name: "Gym Session", icon: "💪", color: "#EF4444", streak: 18 },
      { name: "DSA Practice", icon: "💻", color: "#8B5CF6", streak: 12 },
      { name: "Amul Protein", icon: "🥛", color: "#06B6D4", streak: 14 },
      { name: "7hr Sleep", icon: "😴", color: "#F59E0B", streak: 10 },
      { name: "Evening Reflection", icon: "📝", color: "#EC4899", streak: 8 },
    ];

    for (const habit of habitsData) {
      const { data: habitData } = await supabase.from('habits').insert([{
        ...habit,
        user_id: userId,
      }]).select().single();

      if (habitData) {
        // Add completions for streak days
        const today = new Date();
        for (let i = 0; i < habit.streak; i++) {
          const completionDate = new Date(today);
          completionDate.setDate(today.getDate() - i);
          
          await supabase.from('habit_completions').insert([{
            user_id: userId,
            habit_id: habitData.id,
            completed_date: completionDate.toISOString().split('T')[0],
          }]);
        }
      }
    }

    // DSA problems you're working on
    const dsaProblems = [
      { problem_name: "Binary Search", difficulty: "easy", topic: "Array" },
      { problem_name: "Merge Intervals", difficulty: "medium", topic: "Array" },
      { problem_name: "LCA in Binary Tree", difficulty: "medium", topic: "Tree" },
      { problem_name: "Longest Palindromic Substring", difficulty: "medium", topic: "DP" },
      { problem_name: "Graph Traversal BFS/DFS", difficulty: "medium", topic: "Graph" },
      { problem_name: "Sliding Window Maximum", difficulty: "hard", topic: "Sliding Window" },
      { problem_name: "Detect Cycle in Graph", difficulty: "medium", topic: "Graph" },
    ];

    for (const problem of dsaProblems) {
      await supabase.from('dsa_problems').insert([{
        ...problem,
        user_id: userId,
      }]);
    }

    // Your optimized daily schedule
    const schedulesData = [
      { schedule_type: "weekday", time_slot: "6:00 AM", task: "Wake + Water + Prayer", emoji: "🙏", task_type: "routine" },
      { schedule_type: "weekday", time_slot: "6:15 AM", task: "Gym (Push/Pull/Legs)", emoji: "🏋️", task_type: "gym" },
      { schedule_type: "weekday", time_slot: "7:15 AM", task: "Breakfast + Amul Protein", emoji: "🥣", task_type: "routine" },
      { schedule_type: "weekday", time_slot: "8:30 AM", task: "College Classes", emoji: "🎓", task_type: "college" },
      { schedule_type: "weekday", time_slot: "5:00 PM", task: "Power Nap/Reset", emoji: "😴", task_type: "break" },
      { schedule_type: "weekday", time_slot: "5:30 PM", task: "TUF DSA Concept Video", emoji: "📹", task_type: "study" },
      { schedule_type: "weekday", time_slot: "6:15 PM", task: "Striver Sheet (2-3 Qs)", emoji: "💻", task_type: "study" },
      { schedule_type: "weekday", time_slot: "7:15 PM", task: "Dinner", emoji: "🍽️", task_type: "routine" },
      { schedule_type: "weekday", time_slot: "8:00 PM", task: "DSA Revision OR Dev", emoji: "⚡", task_type: "study" },
      { schedule_type: "weekday", time_slot: "9:00 PM", task: "Wind Down", emoji: "🧘", task_type: "break" },
      { schedule_type: "weekday", time_slot: "10:15 PM", task: "Prayer + Next Day Prep", emoji: "📋", task_type: "routine" },
      { schedule_type: "weekday", time_slot: "10:30 PM", task: "Sleep (7hrs)", emoji: "💤", task_type: "routine" },
      
      // Weekend schedule
      { schedule_type: "saturday", time_slot: "9:00 AM", task: "DSA Mock Contest", emoji: "🏆", task_type: "study" },
      { schedule_type: "saturday", time_slot: "10:00 AM", task: "Cohort 3.0 Project Build", emoji: "🛠️", task_type: "study" },
      { schedule_type: "saturday", time_slot: "2:00 PM", task: "Push + Polish + Host", emoji: "🚀", task_type: "study" },
      { schedule_type: "saturday", time_slot: "6:00 PM", task: "DSA Revise", emoji: "📚", task_type: "study" },
      { schedule_type: "saturday", time_slot: "8:00 PM", task: "System Design Video", emoji: "🎬", task_type: "study" },
      
      { schedule_type: "sunday", time_slot: "9:00 AM", task: "Striver Sheet Weekly Review", emoji: "📊", task_type: "study" },
      { schedule_type: "sunday", time_slot: "11:00 AM", task: "Resume/GitHub/LinkedIn Update", emoji: "💼", task_type: "study" },
      { schedule_type: "sunday", time_slot: "2:00 PM", task: "Read/Reflect", emoji: "📖", task_type: "routine" },
      { schedule_type: "sunday", time_slot: "5:00 PM", task: "Weekly Plan Reset", emoji: "🔄", task_type: "routine" },
    ];

    for (const schedule of schedulesData) {
      await supabase.from('schedules').insert([{
        ...schedule,
        user_id: userId,
      }]);
    }

    // Add gym check-in for today (you're consistent!)
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('gym_checkins').insert([{
      user_id: userId,
      checkin_date: today,
    }]);

    console.log('Comprehensive life strategy data seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding comprehensive data:', error);
    return { success: false, error };
  }
};
