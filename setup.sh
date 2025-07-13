#!/usr/bin/env bash

# Install app & dev dependencies
npm install

# Initialize Supabase (for database needs in TodoList app)
npx supabase init

# Start local Supabase stack (Docker must be running)
npx supabase start

echo "✅ Project initialized. Next: Proceed with document generation as per GROK-NEW-PROJECT-SETUP.md." 