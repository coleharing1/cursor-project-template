-- Add parent_id to categories table for subcategories
ALTER TABLE categories 
ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Update RLS policies to include parent categories
DROP POLICY IF EXISTS "User can view own categories" ON categories;
CREATE POLICY "User can view own categories" ON categories
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    -- Allow viewing parent category if user owns any subcategory
    id IN (
      SELECT parent_id FROM categories 
      WHERE user_id = auth.uid() AND parent_id IS NOT NULL
    )
  );

-- Add a check constraint to prevent circular references
CREATE OR REPLACE FUNCTION check_category_hierarchy()
RETURNS TRIGGER AS $$
DECLARE
  current_parent_id UUID;
  hierarchy_depth INT := 0;
BEGIN
  -- Prevent more than 2 levels of hierarchy (parent -> child only)
  IF NEW.parent_id IS NOT NULL THEN
    SELECT parent_id INTO current_parent_id FROM categories WHERE id = NEW.parent_id;
    IF current_parent_id IS NOT NULL THEN
      RAISE EXCEPTION 'Categories can only have one level of subcategories';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_category_hierarchy_trigger
BEFORE INSERT OR UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION check_category_hierarchy();