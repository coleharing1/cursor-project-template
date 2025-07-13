-- Add position field for task ordering within categories
ALTER TABLE tasks 
ADD COLUMN position INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX idx_tasks_category_position ON tasks(category_id, position);

-- Update existing tasks to have sequential positions within their categories
WITH positioned_tasks AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY category_id 
      ORDER BY created_at DESC
    ) - 1 as new_position
  FROM tasks
  WHERE category_id IS NOT NULL
)
UPDATE tasks
SET position = positioned_tasks.new_position
FROM positioned_tasks
WHERE tasks.id = positioned_tasks.id;

-- Create function to automatically set position for new tasks
CREATE OR REPLACE FUNCTION set_task_position()
RETURNS TRIGGER AS $$
BEGIN
  -- If position is not set, add to end of list
  IF NEW.position IS NULL AND NEW.category_id IS NOT NULL THEN
    SELECT COALESCE(MAX(position), -1) + 1
    INTO NEW.position
    FROM tasks
    WHERE category_id = NEW.category_id
    AND user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new tasks
CREATE TRIGGER set_task_position_trigger
BEFORE INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_task_position();