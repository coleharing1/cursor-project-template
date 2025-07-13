-- Migration generated with supabase-mcp (AI-assisted: 'Generate schema for tasks with hierarchies, categories, user ownership')
-- Tables: tasks, categories

CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  header TEXT
);

CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  duration INTERVAL,
  due_date TIMESTAMPTZ,
  tags TEXT[],
  parent_id UUID REFERENCES tasks(id),
  category_id UUID REFERENCES categories(id),
  is_focused BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_due_date_idx ON tasks(due_date);

-- Note: Logs can be derived from completed_at; No separate table needed unless expanding. 