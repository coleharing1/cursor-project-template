-- Seed data for testing
-- This will only be applied in local development when running `supabase db reset`

-- Note: This seed file assumes a user already exists. 
-- In local development, you'll need to sign up first to create a user,
-- then update the user_id below with your actual user ID from the auth.users table.

-- You can find your user ID by:
-- 1. Signing up in the app
-- 2. Going to http://127.0.0.1:54323 (Supabase Studio)
-- 3. Navigate to Authentication > Users
-- 4. Copy your user ID

-- Example seed data (replace 'YOUR_USER_ID_HERE' with an actual user ID):
/*
INSERT INTO categories (id, user_id, name, color, icon, header)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'YOUR_USER_ID_HERE', 'Work', '#3B82F6', 'briefcase', 'Professional'),
  ('550e8400-e29b-41d4-a716-446655440002', 'YOUR_USER_ID_HERE', 'Personal', '#10B981', 'home', 'Life'),
  ('550e8400-e29b-41d4-a716-446655440003', 'YOUR_USER_ID_HERE', 'Health', '#EF4444', 'heart', 'Wellness');

INSERT INTO tasks (user_id, title, description, priority, duration, category_id, is_focused)
VALUES 
  ('YOUR_USER_ID_HERE', 'Complete quarterly report', 'Finish Q4 2024 financial report', 'high', 120, '550e8400-e29b-41d4-a716-446655440001', true),
  ('YOUR_USER_ID_HERE', 'Team standup meeting', 'Daily sync with development team', 'medium', 15, '550e8400-e29b-41d4-a716-446655440001', true),
  ('YOUR_USER_ID_HERE', 'Grocery shopping', 'Buy items for the week', 'low', 45, '550e8400-e29b-41d4-a716-446655440002', false),
  ('YOUR_USER_ID_HERE', 'Morning workout', '30 min cardio + stretching', 'medium', 30, '550e8400-e29b-41d4-a716-446655440003', true);
*/