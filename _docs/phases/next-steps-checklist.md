# Next Steps Checklist for TodoList Project

## Overview
Based on a full review of the project (_docs/ files, phases, README.md, setup.sh), this checklist outlines the prioritized next actions to move from planning to implementation. It starts with completing the setup phase, establishing version control, and updating trackers, then progresses to MVP. Priorities: High (immediate), Med (follow-up), Low (optional polish). Update status as completed; Reference @setup-phase.md for details.

| Step | Description | Priority | Status | Related Docs/Notes |
|------|-------------|----------|--------|-------------------|
| 1. Complete Local Setup | Run `./setup.sh` (if not fully executed); Verify Next.js init (`npx create-next-app@latest --typescript --tailwind --eslint`), Supabase start, and env vars setup. Install additional deps (e.g., @supabase/supabase-js, shadcn-ui, vitest). | High | Planned | @setup-phase.md (Steps 1-2); Ensure Docker running; Fix any npm errors from prior run. |
| 2. Initialize Git Repo | If not done: `git init`, add .gitignore (node_modules, .env.local), initial commit with docs. Set up remote (e.g., GitHub). | High | Planned | README.md (Setup); Add Husky for hooks per @project-rules.md. |
| 3. Implement Supabase Schema with MCP | Install supabase-mcp; Use it to generate/test schema (tasks, categories, logs); Apply migrations and RLS policies. | High | Planned | @setup-phase.md (Steps 3-4); Mitigate leaks per @tech-stack.md; Test locally. |
| 4. Basic Integration and Test | Add Supabase client/auth in lib/; Create a test route for auth; Run local server and verify. | High | Planned | @setup-phase.md (Step 5); Update @project-history.md with entry. |
| 5. Update Trackers Post-Setup | Mark setup items as Complete in @key-features-checklist.md and @pages-urls-status.md (e.g., /login route); Append to @project-history.md. | Med | Planned | @key-features-checklist.md; Commit changes. |
| 6. Begin MVP Phase: Auth and CRUD | Implement login/signup, protect routes; Add task CRUD with optimistic UI. | Med | Planned | @mvp-phase.md (Steps 1-2); Follow functional style in @project-rules.md. |
| 7. MVP Views and Testing | Build dashboard, All Tasks, Focus List; Add tests with Vitest; Deploy preview to Vercel. | Med | Planned | @mvp-phase.md (Steps 3-5); Ensure mobile-first per @ui-rules.md. |
| 8. Review and Iterate | Audit for rules compliance (e.g., <500 lines); Gather feedback; Update docs if needed. | Low | Planned | @project-rules.md; Use Cursor agents for refactoring. |
| 9. Plan Enhancements | After MVP deploy, prioritize hierarchies/stats based on usage. | Low | Planned | @enhancements-phase.md; Monitor with Vercel analytics. | 