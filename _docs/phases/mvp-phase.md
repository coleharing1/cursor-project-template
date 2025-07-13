# MVP Phase: Core Task Management and Views

## Scope and Deliverables
Building on setup, this phase implements essential features for minimum viability: Basic task CRUD, all tasks view, daily focus list, completions with logging, and simple categories. Per @project-overview.md and @user-flow.md, focus on pain points like unified viewing and focus selection. Deliverables: Functional app with auth-guarded routes, data persistence, and basic UI using Shadcn/Tailwind.

## Steps
1. **Auth Implementation**: Set up Supabase auth in Next.js (login/signup pages); Protect routes with middleware.
2. **Task CRUD**: Create API routes/edge functions for create/read/update/delete tasks; Integrate optimistic updates in UI.
3. **Views and Navigation**: Build dashboard with All Tasks accordion view; Add Today's Focus sidebar with quick-add.
4. **Completions and Logging**: Implement toggle completion with timestamp; Basic /log view grouping by date.
5. **Testing and Deploy**: Write Vitest tests for core logic; Deploy to Vercel preview; Ensure <500-line files per @project-rules.md. 