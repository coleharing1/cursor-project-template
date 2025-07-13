# Setup Phase: Barebones Framework and Database Initialization

## Scope and Deliverables
This phase establishes the foundational structure for the TodoList app, focusing on setting up the Next.js framework, Supabase database with initial schema/migrations/RLS, and basic configurations per @project-overview.md, @user-flow.md, @tech-stack.md, and @project-rules.md. Deliverables: Running local app with auth, empty DB tables for tasks/categories/logs, and supabase-mcp integrated for AI schema assistance. No UI/features yet—focus on scaffolding.

## Steps
1. **Initialize Next.js Project**: Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router; Configure ESLint/Husky per @project-rules.md.
2. **Set Up Supabase**: Follow @DATABASE-OVERVIEW.md—`npx supabase init`, `npx supabase start` for local; Link to prod project.
3. **AI-Assisted Schema Generation**: Install supabase-mcp (`npm i supabase-mcp --save-dev`); Use it to generate initial tables (e.g., tasks with id, title, description, priority, due_date, tags, parent_id, category_id, user_id, is_focused, completed_at); Mitigate leaks by enabling 2025 filters in config.
4. **Migrations and RLS**: Create migration for tables; Apply locally with `npx supabase db reset`; Set RLS policies (e.g., enable on tasks: allow select/insert/update if auth.uid() = user_id).
5. **Basic Integration**: Add Supabase client in lib/; Test auth in a simple route; Commit to Git. 