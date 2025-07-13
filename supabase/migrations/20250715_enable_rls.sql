-- Enable RLS and Policies

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Note: Subtask access is already handled by the main "User can view own tasks" policy
-- since subtasks also have the same user_id as their parent tasks 