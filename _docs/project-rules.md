# Project Rules: AI-First Codebase Conventions

## Project Rules Overview
This document outlines rules for the TodoList app's codebase to ensure it's modular, scalable, and optimized for AI tools like Cursor. Drawing from @project-overview.md, @user-flow.md, @tech-stack.md, @ui-rules.md, and @theme-rules.md, we prioritize functional patterns, descriptive elements, and <500-line files. The focus is on navigability for task management features (e.g., hierarchical views, daily focus), with TypeScript for safety and Next.js App Router for routing. This aligns with 2025 trends like AI-assisted refactoring via Cursor's background agents and maps over enums for flexibility.

Rationale: AI-first design enhances searchability (semantic names/comments) and maintainability, supporting iterative development in phases.

## Directory Structure
Organize for separation of concerns: app/ for routes, components/ for UI, lib/ for utilities. Keep files <500 lines by modularizing.

- app/: Next.js routes and pages (e.g., app/dashboard/page.tsx for main view).
- components/: Reusable UI elements (e.g., components/TaskAccordion.tsx for hierarchies).
- lib/: Utilities, hooks, API clients (e.g., lib/supabaseClient.ts for DB interactions).
- types/: Shared TypeScript types (e.g., types/task.ts for task interfaces).
- _docs/: Documentation (e.g., this file).
- public/: Static assets (e.g., icons).
- tests/: Colocated or dedicated (e.g., components/TaskAccordion.test.tsx).

## Naming Conventions
- Files: kebab-case (e.g., task-list.tsx).
- Components: PascalCase (e.g., TaskList).
- Variables: Descriptive with auxiliaries (e.g., isTaskFocused, hasCompletedTasks).
- Functions: Descriptive (e.g., fetchUserTasks).
- Types: PascalCase (e.g., TaskType).

## Code Style and Best Practices
- Core Rules: Functional/declarative; No classes—use hooks/composition; Iteration over duplication (e.g., map for task renders); Throw errors instead of fallbacks (e.g., throw on failed Supabase query).
- Comments: @fileoverview at file top (e.g., /** @fileoverview Utility for task fetching */); TSDoc for functions (e.g., /** @description Fetches tasks @param {string} userId */).
- Other: Maps over enums (e.g., const priorities = new Map([['high', { color: 'red' }]])); Use 'function' for pure functions; Concise conditionals (e.g., isFocused && <Component />); <500 lines—split large files (e.g., separate hooks from components).
- 2025 Trends: Leverage Next.js App Router for all routing; Use Cursor background agents for auto-modularization.

Example TSDoc:
```typescript
/** 
 * @description Fetches user tasks from Supabase.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Task[]>} Array of tasks.
 */
export async function fetchUserTasks(userId: string): Promise<Task[]> {
  // ...
}
```

## File Guidelines
- Max Length: <500 lines—modularize (e.g., extract hooks from large components).
- Headers: Start with @fileoverview summary.
- Imports: Use aliases (e.g., import { Task } from '@/types/task').

## Tools and Enforcement
- Linters: ESLint with plugins for functional rules, TSDoc enforcement.
- Hooks: Husky for pre-commit (run tests, lint).
- Integration: Enforce in phases (e.g., MVP: Core components follow rules).

## References and Next Steps
- Link to @tech-stack.md, @ui-rules.md.
- Next: Audit codebase with linter; Proceed to phase docs. 