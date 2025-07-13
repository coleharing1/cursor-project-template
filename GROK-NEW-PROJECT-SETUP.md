# New Project Setup Guide

This guide outlines a streamlined, AI-assisted workflow for initializing a new project in Cursor AI (or similar IDEs) as of July 2025. It emphasizes documentation-first development to ensure clarity, scalability, and collaboration. By creating core documents sequentially, we build a solid foundation: starting with context (overview, flows), moving to decisions (tech, UI, theme), then rules (code organization), and finally execution (phases).

This approach leverages Cursor's AI features like Composer, Chat, and rules for automation, reducing setup time to under an hour for most projects. It's tailored for web apps (e.g., AI-integrated full-stack), but adaptable. Assume a GitHub template repo for boilerplate (see Step 0 below).

## Prerequisites
- **Tools**: Cursor AI (with Pro for advanced AI), Docker (for local DB if using Supabase), Git, npm/Yarn.
- **Best Practices (2025 Updates)**: Use Cursor's workflow templates for chained prompts; integrate supabase-mcp for AI-DB interactions; enforce <500-line files for AI compatibility; prioritize accessibility (WCAG 2.2) and sustainability (e.g., optimized bundles).
- **Security Note (2025)**: When using supabase-mcp for AI-DB agents, enable the July 2025 prompt-injection mitigations to prevent data leaks. Always test new MCP rules locally before pushing to production.
- **Template Repo**: Create/clone a GitHub template with:
  - `_docs/` folder (empty placeholders for overview.md, etc.).
  - `.cursorrules.md` (global AI rules).
  - `setup.sh` script for init (npm install, supabase init, **supabase-mcp pre-install**).
  - `package.json`: Pre-install dev dependencies such as `supabase/cli`, `supabase-mcp`, and `husky` (for Git hooks).
  - `.env.local.example` for env vars.

Run `setup.sh` after cloning to bootstrap.

Example `setup.sh` (simplified):

```bash
#!/usr/bin/env bash

# Install app & dev dependencies
npm install

# Install MCP for AI-driven DB autonomy
npm install supabase-mcp --save-dev

# Initialize Supabase (if project requires a database)
npx supabase init

# Start local Supabase stack (Docker must be running)
npx supabase start

echo "✅  Project initialized. Edit _docs/project-overview.md first."
```

## Recommended Document Order
Build documents in this sequence to layer context naturally:

1. `project-overview.md`: Define purpose, scope, goals, audience.
2. `user-flow.md`: Map user journeys and feature interconnections.
3. `tech-stack.md`: Select and detail technologies.
4. `ui-rules.md`: Set design principles and interaction guidelines.
5. `theme-rules.md`: Outline colors, typography, spacing for consistency.
6. `project-rules.md`: Specify folder structure, naming, code style.
7. `./phases/` (subdir in `_docs/`): Phase docs for iterative development (e.g., setup-phase.md, mvp-phase.md).

Place all in `_docs/` for organization.

## Step-by-Step Workflow with AI Prompts
Use Cursor Chat (Cmd+L) or Composer (Cmd+I) for generation. Reference prior docs with @filename.md. If unclear, AI should ask questions—no assumptions.

### 0. Initialize Repo (User Action)
- Clone your template repo.
- Run `setup.sh`.
- Open in Cursor; enable Knowledge uploads for guides (e.g., upload this file as @setup-guide.md).

### 1. Create `project-overview.md`
**Prompt:**
```
Generate project-overview.md as the foundational doc. Use this structure: Title, Executive Summary, Purpose/Objectives, Target Audience/Personas (table), Scope (in/out/assumptions), Goals/Metrics, Risks/Mitigations, Next Steps.

Base on my project idea: [Describe briefly, e.g., "AI recipe generator web app"]. Make it concise, actionable, and SMART. Ask for details on audience, scope, etc., if needed.
```

**Note**: This sets the tone. Use LLM templates for overviews if available (e.g., from prior chats).

### 2. Create `user-flow.md`
**Prompt:**
```
Using @project-overview.md, create user-flow.md defining user journeys. Cover key segments: landing, onboarding, core interactions, navigation, errors/redirects.

Account for features and connections (e.g., from registration to dashboard). Use diagrams (Mermaid syntax) or bullet flows. No assumptions—ask if flows are unclear.

This guides architecture and UI.
```

**Note**: For complex apps, include edge cases like auth failures.

### 3. Recommend and Finalize `tech-stack.md`
**Prompt (Initial Recommendations):**
```
Using @project-overview.md and @user-flow.md, First create @tech-stack.md then inside it recommend a stack. I prefer: TypeScript, React, Tailwind CSS and everything in @DATABASE-OVERVIEW.md .

For each category (language, UI lib, CSS, framework, DB/auth, deployment), propose an industry standard and one alternative. Describe roles, pros/cons, compatibility.

Categories: Language, Frontend Framework, UI Library, CSS Framework, Component Lib, Backend/DB, Deployment, Others (e.g., testing).
```

**User Action**: Review proposals. Ask AI for deeper pros/cons (e.g., "Compare Supabase vs. Firebase for auth"). Then prompt:
```
I like the standard recomendations on everything you suggested. please update @tech-stack.md to reflect only those
```

**Prompt (Enhance):**
```
Update @tech-stack.md with best practices, limitations, conventions, and pitfalls for each technology. Be thorough: e.g., Next.js App Router gotchas, Supabase RLS setup, and **supabase-mcp for AI queries (include data-leak risk mitigations per July 2025 reports)**. Reference 2025 updates like Next.js 15 optimizations and Cursor's background agents.
```

**Note**: For AI apps, default to Vercel for edge functions; integrate DATABASE-OVERVIEW.md if DB-heavy.

### 4. Explore and Create `ui-rules.md` & `theme-rules.md`
**Prompt (Design Exploration):**
```
Walk through common design principles for this app type (from @project-overview.md, @user-flow.md). Recommend styles: minimalist, glassmorphic, neumorphic, etc., with fits/why.

Suggest accessibility, responsiveness, animations. Teach basics if I'm new.
```

**User Action**: Decide preferences (e.g., "mobile-first, responsive; theme: minimalist").

**Prompt (Generate Files):**
```
I want: mobile-first, responsive, subtle animations.

Theme: minimalist.

Using @project-overview.md, @user-flow.md, @tech-stack.md, create ui-rules.md (principles: hierarchy, consistency, feedback) and theme-rules.md (colors/table, typography, spacing, shadows; code examples for Tailwind/CSS vars).
```

**Note**: Use LLM templates for these (e.g., from prior generations). Reference `@PROJECT-OVERVIEW-TEMP.md` for overviews and `@THEME-RULES-TEMP.md` for themes. For real-world examples, see `@TAN-THEME-RULES.md`. Ensure WCAG compliance (2.2) in themes.

### 5. Create `project-rules.md`
**Prompt:**
```
Build an AI-first codebase: modular, scalable, navigable. Files: descriptive names, top explanations, TSDoc comments; <500 lines.

Using @tech-stack.md, @user-flow.md, @project-overview.md, @ui-rules.md, @theme-rules.md, create project-rules.md: directory structure (e.g., app/, components/, lib/), naming conventions (kebab-case files, PascalCase components), code style (functional, no classes, descriptive vars).
```

**Note**: Align with 2025 trends: Use app router in Next.js; maps over enums.
Reference `@PROJECT-RULES-TEMP.md` for a structured template, including AI-first principles like modularity and descriptive conventions. Ensure rules promote functional patterns and <500-line files as per user guidelines.

### 6. Create Phase Documents in `_docs/phases/`
**Prompt:**
```
Create iterative plan: Setup (barebones framework), MVP (core value), Enhancements (polish, features).

Rules: Start with setup-phase.md; each phase doc details scope/deliverables; features in 1-5 steps; build iteratively.

Use @project-overview.md, @user-flow.md, @tech-stack.md, @project-rules.md. Output as separate files in _docs/phases/.
```

**Note**: For DB-centric apps, include **migrations and RLS policies** in `setup-phase.md` (see `@DATABASE-OVERVIEW.md`). Leverage **supabase-mcp** for AI-assisted schema generation.

### 7. Create Key Features Checklist
**Prompt:**
```
Using @project-overview.md, @user-flow.md, and _docs/phases/ (e.g., @setup-phase.md, @mvp-phase.md), create key-features-checklist.md as a markdown table with checkboxes for core features, priorities (High/Med/Low), and links to related docs. Set initial status to Planned. This tracks progress and ensures alignment with goals.
```

**Note**: Review and update this checklist after each phase completion. For details on maintenance, see the instructions in KEY-FEATURES-INS.md (upload as @key-features-ins.md if needed).

### 8. Create Pages and URLs Status Tracker
**Prompt:**
```
Based on @user-flow.md, @project-overview.md, and _docs/phases/, generate pages-urls-status.md as a markdown table listing key pages/routes, URLs, descriptions, initial status (Planned), and notes/links. This helps visualize app structure and monitor build progress.
```

**Note**: Update status (e.g., to In Progress or Complete) after implementing routes. Integrate with deployments for verification; see PAGES-URLS_INS.md for full instructions.

### 9. Create Project History Log
**Prompt:**
```
Initialize project-history.md as a reverse-chronological log starting with an entry for project setup (e.g., date, commit summary, changes, rationale). Base the first entry on this repo's initialization. Use it to track commits narratively for AI context.
```

**Note**: Append new entries after each significant commit via AI prompts or git hooks. This provides session-persistent context; reference PROJECT-HISTORY-INS.md for maintenance tips.

### 10. Set Up Agent Rules (User Action)
Create `.cursorrules.md` or User Rules in Cursor:

> **WARNING**: If you already have your own User Rules configured in Cursor (via Settings > Rules > User Rules), **skip this step** to avoid conflicts or overrides. You can always merge or customize later.

```
You are an expert in [tech from stack, e.g., TypeScript, Next.js, Supabase, **supabase-mcp**].
Build production-grade, clean code; question user assumptions.
Familiarize with codebase first.

AI-first: Modular, <500 lines, descriptive names/comments.

Style: Functional/declarative; block comments; no duplication; throw errors; aux verbs in vars; maps not enums; "function" for pure; concise conditionals.
```

**Note**: Upload to Knowledge or Notepad for attachment.

### 11. Update README.md
**Prompt:**
```
Using @project-overview.md, @user-flow.md, @tech-stack.md, @project-rules.md, update README.md: Brief overview, setup instructions, conventions, contribution guidelines.
```

### 12. Final Checks (User Action)

---

### 13. Ongoing Maintenance

1. **Accessibility & Performance Audits**: Run Lighthouse (or the 2025 open-source equivalent) regularly to track Core Web Vitals and WCAG compliance.
2. **Dependency Updates**: Monitor release notes for Next.js, Supabase, and supabase-mcp. Apply security patches promptly (e.g., July 2025 MCP leak fix).
3. **AI Workflow Upgrades**: Enable Cursor’s background agents and enhanced Composer (May 2025) for multi-file edits; adjust `.cursorrules.md` as features evolve.
4. **CI/CD Enhancements**: Expand GitHub Actions to include automated test, lint, and accessibility checks before deploys.
5. **Knowledge Base Refresh**: Periodically re-upload updated docs to Cursor Knowledge to keep AI responses aligned.

---

**Let's Get Started**: Prompt AI with your project idea to generate project-overview.md first!

### Appendix: Alternative Prompts and Rules from Legacy Setup
This section incorporates elements from an earlier setup guide (PALMER-NEW-PROJECT-SETUP.md) for completeness. Use these as variations if the main prompts don't fit your style.

#### Alternative Agent Rules Example
```
You are an expert in TypeScript, Node.js, NextJS + App Router, React, Shadcn, Radix UI and Tailwind CSS.
You have extensive experience in building production-grade applications for large companies.
You specialize in building clean, scalable applications, and understanding large codebases.
Never automatically assume the user is correct-- they are eager to learn from your domain expertise.
Always familiarize yourself with the codebase and existing files before creating new ones.

We are building an AI-first codebase, which means it needs to be modular, scalable, and easy to understand. The file structure should be highly navigable, and the code should be well-organized and easy to read.

All files should have descriptive names, an explanation of their contents at the top, and all functions should have proper commentation of their purpose and parameters (JSDoc, TSDoc, etc, whatever is appropriate).
To maximize compatibility with modern AI tools, files should not exceed 500 lines.

Code Style and Structure:

- Write concise, technical code.
- Use functional and declarative programming patterns; avoid classes.
- Decorate all functions with descriptive block comments.
- Prefer iteration and modularization over code duplication.
- Throw errors instead of adding fallback values.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Avoid enums; use maps instead.
- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
```

#### Prompt Variations
- For Tech Stack: "Walk me through pros/cons for each category before finalizing."
- For UI/Theme: "If I want [specific style, e.g., neumorphic], adjust the prompts accordingly."

**Note**: This appendix consolidates from a legacy version to reduce redundancy—prefer the main GROK workflow for new projects.