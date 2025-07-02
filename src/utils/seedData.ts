
import { supabase } from '@/integrations/supabase/client';

export const seedUserData = async (userId: string) => {
  try {
    console.log('Starting data seeding for user:', userId);

    // Sample todos
    const todosData = [
      { text: "Complete React project", priority: "high", category: "study", completed: false },
      { text: "Morning workout", priority: "medium", category: "gym", completed: true },
      { text: "Read 30 pages of book", priority: "low", category: "personal", completed: false },
      { text: "Submit assignment", priority: "high", category: "college", completed: false },
      { text: "Practice coding interview", priority: "medium", category: "study", completed: true },
      { text: "Grocery shopping", priority: "low", category: "personal", completed: false },
    ];

    for (const todo of todosData) {
      await supabase.from('todos').insert([{
        ...todo,
        user_id: userId,
      }]);
    }

    // Sample notes
    const notesData = [
      { content: "Remember to review the React hooks documentation for the upcoming project." },
      { content: "Great workout today! Increased bench press by 5 lbs." },
      { content: "Book recommendation: 'Atomic Habits' - really insightful about building good habits." },
      { content: "Meeting with advisor next Tuesday at 2 PM to discuss thesis progress." },
      { content: "Code review feedback: Focus more on error handling and edge cases." },
    ];

    for (const note of notesData) {
      await supabase.from('notes').insert([{
        ...note,
        user_id: userId,
      }]);
    }

    // Sample habits
    const habitsData = [
      { name: "Morning Meditation", icon: "🧘", color: "#10B981", streak: 7 },
      { name: "Daily Reading", icon: "📚", color: "#3B82F6", streak: 12 },
      { name: "Exercise", icon: "💪", color: "#EF4444", streak: 5 },
      { name: "Drink Water", icon: "💧", color: "#06B6D4", streak: 15 },
      { name: "Code Practice", icon: "💻", color: "#8B5CF6", streak: 8 },
    ];

    for (const habit of habitsData) {
      const { data: habitData } = await supabase.from('habits').insert([{
        ...habit,
        user_id: userId,
      }]).select().single();

      if (habitData) {
        // Add some random completions for the last few days
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

    // Sample DSA problems
    const dsaProblems = [
      { problem_name: "Two Sum", difficulty: "easy", topic: "Array" },
      { problem_name: "Valid Parentheses", difficulty: "easy", topic: "Stack" },
      { problem_name: "Merge Two Sorted Lists", difficulty: "easy", topic: "Linked List" },
      { problem_name: "Binary Tree Inorder Traversal", difficulty: "medium", topic: "Tree" },
      { problem_name: "3Sum", difficulty: "medium", topic: "Array" },
    ];

    for (const problem of dsaProblems) {
      await supabase.from('dsa_problems').insert([{
        ...problem,
        user_id: userId,
      }]);
    }

    // Sample schedules
    const schedulesData = [
      { schedule_type: "weekday", time_slot: "6:00 AM", task: "Morning Workout", emoji: "🏋️", task_type: "gym" },
      { schedule_type: "weekday", time_slot: "7:30 AM", task: "Breakfast & Coffee", emoji: "☕", task_type: "routine" },
      { schedule_type: "weekday", time_slot: "9:00 AM", task: "Data Structures Study", emoji: "📊", task_type: "study" },
      { schedule_type: "weekday", time_slot: "11:00 AM", task: "College Lectures", emoji: "🎓", task_type: "college" },
      { schedule_type: "weekday", time_slot: "1:00 PM", task: "Lunch Break", emoji: "🍽️", task_type: "break" },
      { schedule_type: "weekday", time_slot: "2:00 PM", task: "Project Work", emoji: "💻", task_type: "study" },
      { schedule_type: "weekday", time_slot: "4:00 PM", task: "Assignment Review", emoji: "📝", task_type: "college" },
      { schedule_type: "weekday", time_slot: "6:00 PM", task: "Evening Workout", emoji: "🏃", task_type: "gym" },
      { schedule_type: "weekday", time_slot: "8:00 PM", task: "Dinner", emoji: "🍽️", task_type: "routine" },
      { schedule_type: "weekday", time_slot: "9:00 PM", task: "Reading Time", emoji: "📖", task_type: "routine" },
    ];

    for (const schedule of schedulesData) {
      await supabase.from('schedules').insert([{
        ...schedule,
        user_id: userId,
      }]);
    }

    // Add gym check-in for today
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('gym_checkins').insert([{
      user_id: userId,
      checkin_date: today,
    }]);

    console.log('Data seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, error };
  }
};
