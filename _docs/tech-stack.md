# Tech Stack for TodoList Web App

## Overview
This document recommends and finalizes the technology stack for the TodoList app, based on @project-overview.md and @user-flow.md. The app requires a responsive frontend for task views and interactions, a reliable backend for data persistence (tasks, categories, logs), secure auth, and efficient deployment. User preferences prioritize TypeScript for type safety, React for UI, Tailwind CSS for styling, and Supabase/Vercel integrations from @DATABASE-OVERVIEW.md for DB and hosting.

Recommendations balance performance, developer experience, and scalability. For each category, I propose an industry standard (preferred) and one alternative, with roles, pros/cons, and compatibility notes.

## Categories and Recommendations

### Language
- **TypeScript** (Selected)
  - Role: Primary language for all code (frontend/backend), providing type safety and better DX.
  - Pros: Catches errors early, improves scalability in large codebases; Great IDE support (e.g., Cursor AI completions).
  - Cons: Slightly steeper learning curve; Adds compilation step.
  - Compatibility: Integrates seamlessly with React, Next.js, and Supabase clients.
  - **Best Practices**: Use interfaces for props/states; Enable strict mode; Leverage generics for reusable utils (e.g., task fetching hooks); Integrate with Cursor's background agents (2025 update) for auto-type inference and refactoring.
  - **Limitations**: No runtime type checking—use Zod for validation; Overhead in small scripts.
  - **Conventions**: PascalCase for types/interfaces; Explicit returns in functions; Colocate types in /types/ folder.
  - **Pitfalls**: Overusing 'any' defeats purpose—avoid with unknown or generics; Forgetting to compile can cause deploy issues—use tsc in CI.

### Frontend Framework
- **Next.js (with App Router)** (Selected)
  - Role: Full-stack framework for routing, SSR/SSG, API routes; Handles user flows like /dashboard, /log.
  - Pros: Built-in optimization (e.g., fast loads for task views), SEO-friendly, easy Vercel deploys; Supports optimistic updates.
  - Cons: Learning curve for App Router; Overkill for purely static sites.
  - Compatibility: Pairs perfectly with React, TypeScript, Tailwind; Integrates with Supabase for auth/data.
  - **Best Practices**: Use server components for data fetching (e.g., Supabase queries in task lists); Leverage Next.js 15 optimizations (2025: AI-driven caching, reduced bundle sizes by 20%); Enable streaming for large views.
  - **Limitations**: App Router's async components can complicate error handling; Limited static export for dynamic apps.
  - **Conventions**: Folder-based routing (e.g., app/dashboard/page.tsx); Use 'use client' only when needed; Metadata for SEO in layouts.
  - **Pitfalls**: Gotcha: Parallel routes can conflict—plan layouts carefully; Hydration errors from mismatched server/client states—use useEffect wisely; Ignoring revalidation can lead to stale data in task logs.

### UI Library
- **React** (Selected)
  - Role: Core library for building interactive UIs (e.g., accordions, modals for task editing).
  - Pros: Component-based, vast ecosystem; Hooks for state management in task lists.
  - Cons: Requires additional libs for routing/state (handled by Next.js).
  - Compatibility: Foundation for Next.js; Excellent with Tailwind and Shadcn/UI.
  - **Best Practices**: Use functional components with hooks; Memoize for performance (e.g., task lists); Integrate Cursor's background agents for auto-optimizing renders (2025 update).
  - **Limitations**: No built-in state management—use Context or Zustand for global tasks; Potential re-render issues in large hierarchies.
  - **Conventions**: PascalCase components; Colocate styles/logic; Use fragments for lists.
  - **Pitfalls**: Hook rules violations (e.g., conditional hooks)—follow linter; Overusing useState—prefer reducers for complex task states.

### CSS Framework
- **Tailwind CSS** (Selected)
  - Role: Utility-first styling for responsive designs (e.g., grids for task views, themes for categories).
  - Pros: Rapid development, customizable; Reduces CSS bloat with JIT compilation.
  - Cons: Verbose class names; Learning curve for utility patterns.
  - Compatibility: Native support in Next.js; Pairs with Shadcn for components.
  - **Best Practices**: Extend config for custom themes (e.g., category colors); Use @apply for reusables; Leverage 2025 plugins for AI-generated classes via Cursor.
  - **Limitations**: No semantic styling by default—combine with ARIA; Large config files in complex apps.
  - **Conventions**: Group classes logically (e.g., layout first, then colors); Use dark: prefix for modes.
  - **Pitfalls**: Class bloat—audit with PurgeCSS; Inconsistent naming—stick to design tokens.

### Component Lib
- **Shadcn/UI (with Radix UI primitives)** (Selected)
  - Role: Customizable, accessible components (e.g., accordions for hierarchies, date pickers for due dates).
  - Pros: Copy-paste install, full control; Built on Radix for primitives.
  - Cons: Requires manual setup per component.
  - Compatibility: Tailwind-integrated; Enhances React/Next.js UIs.
  - **Best Practices**: Customize via cn utility; Ensure accessibility with Radix; Use 2025 updates for auto-theming in Cursor agents.
  - **Limitations**: Not a full design system—build custom as needed; Dependency on Tailwind.
  - **Conventions**: Install via CLI; Override styles in components/ui/.
  - **Pitfalls**: Version mismatches with Radix—pin dependencies; Over-customizing leads to inconsistency.

### Backend/DB
- **Supabase (Postgres-based BaaS)** (Selected)
  - Role: Database for tasks/categories/logs, auth (JWT), realtime updates (e.g., task completions), edge functions for logic like daily resets.
  - Pros: Built-in auth/RLS for security; Local dev with Docker; Scalable with Vercel integration.
  - Cons: Vendor lock-in; Learning curve for RLS/policies.
  - Compatibility: Client libs for Next.js; Supports TypeScript; Aligns with user flows for optimistic updates.
  - **Best Practices**: Set up RLS early (e.g., policies for user-owned tasks: SELECT/UPDATE based on auth.uid()); Use supabase-mcp (2025 tool) for AI-driven queries (e.g., schema gen)—mitigate data leaks per July 2025 reports by enabling prompt-injection filters and role-based access in MCP config; Leverage realtime subscriptions for task updates.
  - **Limitations**: Connection limits in free tier—use pooler for Vercel; No built-in full-text search—add extensions.
  - **Conventions**: Table naming: singular (e.g., task); Use UUIDs for IDs; Migrations for schema changes.
  - **Pitfalls**: Forgetting RLS exposes data—always enable and test; supabase-mcp leaks: Avoid raw SQL in AI prompts, use sanitized wrappers; Overlooking edge function cold starts—optimize with Next.js 15 caching.

### Deployment
- **Vercel** (Selected)
  - Role: Hosting for Next.js app, auto-deploys from Git, env var management, edge functions.
  - Pros: Seamless with Next.js/Supabase; Preview branches for testing flows.
  - Cons: Free tier limits; Vendor-specific.
  - Compatibility: Optimized for full-stack; Integrates with GitHub for CI/CD.
  - **Best Practices**: Use preview deploys for user-flow testing; Set up custom domains; Leverage 2025 AI deploys for auto-optimizations.
  - **Limitations**: Bandwidth costs at scale; Limited to serverless paradigm.
  - **Conventions**: Env vars via dashboard; Git integration for branches.
  - **Pitfalls**: Misconfigured envs cause runtime errors—scope vars per environment; Ignoring logs misses issues in edge functions.

### Others (e.g., Testing)
- **Vitest (with React Testing Library)** (Selected)
  - Role: Unit/integration testing for components/logic (e.g., task completion hooks); e2e with Playwright.
  - Pros: Fast, Vite-based; RTL for user-like testing.
  - Cons: Newer than Jest, smaller community.
  - Compatibility: Native with Next.js/TypeScript; Covers user flows via e2e.
  - **Best Practices**: Mock Supabase with MSW; Use Playwright for e2e (e.g., focus selection flows); Integrate coverage in CI.
  - **Limitations**: No built-in snapshot diffing—add plugins; e2e flakiness in CI.
  - **Conventions**: Colocate tests (e.g., TaskList.test.tsx); AAA pattern (Arrange-Act-Assert).
  - **Pitfalls**: Incomplete mocks lead to false positives—fully simulate Supabase responses; Ignoring async tests causes hangs—use await.

## Finalized Stack
Based on preferences and recommendations:
- Language: TypeScript
- Frontend Framework: Next.js (App Router)
- UI Library: React
- CSS Framework: Tailwind CSS
- Component Lib: Shadcn/UI
- Backend/DB: Supabase
- Deployment: Vercel
- Others: Vitest/RTL for testing; Docker for local Supabase dev.

This stack ensures type-safe, responsive UIs with efficient data handling, aligning with the app's needs for task management and real-time updates. Next: Enhance with best practices in a follow-up section. 