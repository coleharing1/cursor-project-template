# TodoList Web App

## Overview
TodoList is a web application for managing multiple todo lists (e.g., brand-specific, personal, big ideas, daily focus), addressing pain points like unified task viewing, daily selection, completion logging, and ad-hoc additions. It features hierarchical organization, automatic resets, and stats for productivity. For details, see [@project-overview.md](_docs/project-overview.md) and [@user-flow.md](_docs/user-flow.md).

Built with technologies from [@tech-stack.md](_docs/tech-stack.md): Next.js, React, Tailwind CSS, Shadcn/UI, Supabase, Vercel.

## Setup Instructions
1. Clone the repo: `git clone <repo-url>`.
2. Install dependencies: `npm install`.
3. Run setup script: `./setup.sh` (initializes Supabase local; requires Docker).
4. Start dev server: `npm run dev` (runs at http://localhost:3000).
5. For Supabase: Set env vars in .env.local (ref [@DATABASE-OVERVIEW.md](DATABASE-OVERVIEW.md)); `npx supabase start` for local DB.
6. Deploy: Push to GitHub; Vercel auto-deploys (configure in dashboard).

## Conventions
Follow [@project-rules.md](_docs/project-rules.md):
- AI-first: Modular files <500 lines, descriptive names/TSDoc comments.
- Code Style: Functional (no classes), throw errors, maps over enums, concise conditionals.
- Naming: kebab-case files, PascalCase components.
- Database: Ref [@Database-Handling.md](Database-Handling.md) for Supabase rules (RLS, migrations).

## Contribution Guidelines
- Branch: feature/<name> or fix/<name>.
- Commit: Semantic (e.g., feat: add task CRUD).
- PR: Reference related docs (e.g., @mvp-phase.md); Include tests.
- Code Review: Ensure alignment with rules; Run linter/tests.
- Issues: Use GitHub for bugs/features; Link to checklist [@key-features-checklist.md](_docs/key-features-checklist.md).

For phases, see _docs/phases/. 