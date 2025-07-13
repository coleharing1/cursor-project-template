# Pages and URLs Status for TodoList Web App

## Overview
This document tracks key pages/routes based on @user-flow.md, @project-overview.md, @setup-phase.md, @mvp-phase.md, and @enhancements-phase.md. It visualizes app structure with initial status as Planned. Update status (e.g., In Progress, Complete) after implementation; Integrate with Vercel previews for verification. For maintenance, see @PAGES-URLS_INS.md.

| Page/Route | URL | Description | Status | Notes/Links |
|------------|-----|-------------|--------|-------------|
| Homepage | / | Landing with login/signup prompt. | Planned | @user-flow.md (Onboarding); High priority for auth. |
| Dashboard | /dashboard | Main view with overview, links to other sections. | Planned | @mvp-phase.md (Views); Includes focus sidebar. |
| All Tasks View | /tasks/all | Hierarchical accordion of all tasks, with filters. | Planned | @user-flow.md (Viewing All); Pagination for large lists. |
| Today's Focus | /focus/today | Dedicated list for daily focused tasks, quick-add. | Planned | @mvp-phase.md (Views); Auto-reset integration. |
| Historical Log | /log | Date-grouped view of completed tasks and stats. | Planned | @mvp-phase.md (Logging); Group by date with totals. |
| Settings - Categories | /settings/categories | Manage categories (create/edit/assign). | Planned | @enhancements-phase.md (Categories); Color/icon picker. |
| Task Detail/Edit | /tasks/[id] | View/edit single task details (dynamic route). | Planned | @user-flow.md (Task Editing); Optimistic updates. |
| Login | /login | Authentication page. | Planned | @setup-phase.md (Auth); Redirects to dashboard. |
| Signup | /signup | User registration page. | Planned | @setup-phase.md (Auth); Email verification. |
| Settings | /settings | General app settings (e.g., profile, preferences). | Planned | @enhancements-phase.md (Advanced); Low priority. |

## Maintenance Notes
- Update status post-implementation (e.g., after MVP deploy).
- Add new routes as features evolve.
- Verify with e2e tests in @enhancements-phase.md. 