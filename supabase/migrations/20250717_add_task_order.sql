-- Add order column to tasks table for drag-and-drop functionality
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;