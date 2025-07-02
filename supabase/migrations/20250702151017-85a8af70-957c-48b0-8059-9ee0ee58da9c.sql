
-- Add columns to existing habits table for enhanced tracking
ALTER TABLE habits ADD COLUMN IF NOT EXISTS target_frequency INTEGER DEFAULT 1;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Create daily_blocks table for schedule management
CREATE TABLE IF NOT EXISTS daily_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  time_slot TEXT NOT NULL,
  task TEXT NOT NULL,
  emoji TEXT DEFAULT '⚡',
  block_type TEXT DEFAULT 'routine',
  is_active BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create focus_sessions table for tracking work periods
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_type TEXT NOT NULL, -- 'dsa', 'dev', 'study', 'gym'
  duration_minutes INTEGER DEFAULT 25,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reflections table for daily/weekly reviews
CREATE TABLE IF NOT EXISTS reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  reflection_type TEXT NOT NULL, -- 'daily', 'weekly'
  date DATE DEFAULT CURRENT_DATE,
  content JSONB DEFAULT '{}',
  mood_score INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create project_tasks table for dev project tracking
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  project_name TEXT NOT NULL,
  task_title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- 'todo', 'in-progress', 'done'
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE daily_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for daily_blocks
CREATE POLICY "Users can manage their own daily blocks" ON daily_blocks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for focus_sessions
CREATE POLICY "Users can manage their own focus sessions" ON focus_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for reflections
CREATE POLICY "Users can manage their own reflections" ON reflections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for project_tasks
CREATE POLICY "Users can manage their own project tasks" ON project_tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Clear existing data for shivaguptaj26 user (we'll repopulate with new system)
DELETE FROM todos WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'shivaguptaj26@gmail.com');
DELETE FROM dsa_problems WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'shivaguptaj26@gmail.com');
