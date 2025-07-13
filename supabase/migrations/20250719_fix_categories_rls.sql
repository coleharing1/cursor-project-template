-- Fix infinite recursion in categories RLS policy
DROP POLICY IF EXISTS "User can view own categories" ON categories;

-- Create a simpler policy that avoids recursion
CREATE POLICY "User can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);