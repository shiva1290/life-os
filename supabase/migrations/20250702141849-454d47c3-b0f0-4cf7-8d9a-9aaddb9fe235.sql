
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create habits table
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_completions table
CREATE TABLE public.habit_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

-- Create todos table
CREATE TABLE public.todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT DEFAULT 'study' CHECK (category IN ('study', 'gym', 'personal', 'college')),
  created_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('weekday', 'saturday', 'sunday')),
  time_slot TEXT NOT NULL,
  task TEXT NOT NULL,
  emoji TEXT,
  task_type TEXT DEFAULT 'routine' CHECK (task_type IN ('routine', 'gym', 'college', 'study', 'break')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dsa_problems table
CREATE TABLE public.dsa_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_name TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT,
  solved_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gym_checkins table
CREATE TABLE public.gym_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE DEFAULT CURRENT_DATE,
  checkin_time TIME DEFAULT CURRENT_TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_checkins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for habits
CREATE POLICY "Users can view their own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for habit_completions
CREATE POLICY "Users can view their own habit completions" ON public.habit_completions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habit completions" ON public.habit_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit completions" ON public.habit_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for todos
CREATE POLICY "Users can view their own todos" ON public.todos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own todos" ON public.todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own todos" ON public.todos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own todos" ON public.todos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for notes
CREATE POLICY "Users can view their own notes" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for schedules
CREATE POLICY "Users can view their own schedules" ON public.schedules
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own schedules" ON public.schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own schedules" ON public.schedules
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own schedules" ON public.schedules
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for dsa_problems
CREATE POLICY "Users can view their own DSA problems" ON public.dsa_problems
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own DSA problems" ON public.dsa_problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own DSA problems" ON public.dsa_problems
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gym_checkins
CREATE POLICY "Users can view their own gym checkins" ON public.gym_checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own gym checkins" ON public.gym_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gym checkins" ON public.gym_checkins
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'username'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
