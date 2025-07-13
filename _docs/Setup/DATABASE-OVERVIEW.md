\# Professional Workflow Guide: Building Full-Stack Web Apps with Cursor AI, Supabase, Docker, and Vercel

This condensed guide summarizes key concepts, tools, workflows, and best practices from the original document. Use it as a reference in Cursor AI (e.g., via @Codebase or chat prompts) to ensure consistent, professional development. Always prioritize separation of local and production environments, use migrations for schema changes, and automate configurations with environment variables. Reference this for context when generating code, SQL, or troubleshooting.

\#\# 1\. Tools Overview  
\- \*\*Cursor AI\*\*: AI-powered IDE based on VS Code. Use for code generation (Cmd/Ctrl+K for inline edits, Cmd/L for chat), refactoring, debugging, and codebase queries (@Codebase). Install from cursor.com; supports Pro features for advanced AI.  
\- \*\*Supabase\*\*: Postgres-based BaaS for database, auth, APIs, storage, and edge functions. Use CLI for local setup and migrations.  
\- \*\*Docker\*\*: Runs local environments in containers for consistency. Required by Supabase CLI; install Docker Desktop and ensure it's running.  
\- \*\*Vercel\*\*: Deployment platform with Git integration. Auto-deploys on pushes; manages environments (Production, Preview, Development) and env vars.

\#\# 2\. Core Principle: Local vs. Production Environments  
\- \*\*Local (Development)\*\*: On your machine; safe for experimentation. Use dummy data; reset freely. Purpose: Rapid iteration without risks.  
\- \*\*Production\*\*: Live, user-facing; stores real data. Purpose: Reliability and security. Never connect directly during dev.  
\- \*\*Why Separate?\*\*  
  \- Safety: Avoid accidental data loss (e.g., buggy deletes).  
  \- Security: Protect sensitive data; comply with laws like GDPR.  
  \- Integrity: Prevent test data from polluting real data.  
\- Achieve \*\*Parity\*\*: Mirror prod (e.g., same Postgres version) to minimize deployment bugs.

| Aspect          | Local (Docker via Supabase CLI) | Production (Supabase Cloud) |  
|-----------------|---------------------------------|-----------------------------|  
| Database       | Disposable, test data          | Real, optimized, backed up  |  
| Credentials    | From \`npx supabase start\`      | From Supabase Dashboard    |  
| Access         | Local only                     | Public via APIs with RLS   |  
| Risks          | None (sandboxed)               | High (affects users)       |

\#\# 3\. Phase 1: Set Up Production Supabase  
1\. Sign up at supabase.com (free tier).  
2\. Create New Project: Name (e.g., \`my-app-prod\`), set strong DB password, choose region.  
3\. Get Credentials (Project Settings \> API):  
   \- \`SUPABASE\_URL\`: https://\<project-ref\>.supabase.co  
   \- \`ANON\_KEY\`: Public for client-side.  
   \- \`SERVICE\_ROLE\_KEY\`: Secret for server-side.  
   \- Connection Strings: Use Pooler (Transaction Mode) for Vercel/serverless.  
4\. Enable features like RLS for security.

\#\# 4\. Phase 2: Set Up Local Development  
1\. Create project folder; open in Cursor AI.  
3\. Install Supabase CLI: \`npm install supabase \--save-dev\`.  
4\. Install Docker Desktop; run it.  
5\. Initialize: \`npx supabase init\` (creates \`supabase/\` folder—commit to Git).  
6\. Start Local Stack: \`npx supabase start\` (runs Docker containers; outputs local creds like \`http://localhost:54321\` and keys).  
   \- Use local Studio URL for dashboard.  
   \- Credentials are local-only; never mix with prod.

\#\# 5\. Phase 3: Database Migrations and Schema Management  
\- \*\*Schema\*\*: Tables, columns, relationships; manage via migrations (SQL scripts) for versioning.  
\- \*\*Migrations Workflow\*\*:  
  1\. Create: \`npx supabase migration new \<name\>\` (e.g., \`create\_products\_table\`).  
  2\. Generate SQL in Cursor AI: Prompt like "Create SQL for products table: id (BIGINT PK), name TEXT NOT NULL, price NUMERIC DEFAULT 0, created\_at TIMESTAMPTZ DEFAULT NOW()".  
  3\. Apply Locally: \`npx supabase db reset\` (wipes, reapplies all migrations, runs \`supabase/seed.sql\`).  
  4\. Seed Data: Add INSERTs to \`supabase/seed.sql\` (e.g., sample products via AI prompt); reset to populate.  
\- \*\*Push to Prod\*\*: Link project (\`npx supabase link \--project-ref \<id\>\`), then \`npx supabase db push\` (applies only new migrations).

\#\# 6\. Phase 4: Environment Variables for Connections  
\- Store configs outside code; switch environments automatically.  
\- \*\*Local (.env.local)\*\*: Create at root; ignore in \`.gitignore\`.  
  \`\`\`  
  NEXT\_PUBLIC\_SUPABASE\_URL=http://localhost:54321  
  NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=\<local\_anon\_key\>  
  \`\`\`  
\- \*\*Production (Vercel Dashboard \> Settings \> Environment Variables)\*\*:  
  \- Add same keys with prod values; scope to Production.  
\- \*\*Code Example\*\* (e.g., \`lib/supabaseClient.js\`):  
  \`\`\`js  
  import { createClient } from '@supabase/supabase-js';  
  const supabaseUrl \= process.env.NEXT\_PUBLIC\_SUPABASE\_URL;  
  const supabaseAnonKey \= process.env.NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY;  
  export const supabase \= createClient(supabaseUrl, supabaseAnonKey);  
  \`\`\`  
\- Switch: Local loads from \`.env.local\`; Vercel injects dashboard vars.

\#\# 7\. Full Dev-to-Prod Workflow Checklist  
For any feature (e.g., add column and UI):  
1\. Code feature in Cursor AI (use AI for generation/refactoring).  
2\. Create migration; generate SQL via AI.  
3\. Test locally: \`npx supabase db reset\`; run app (\`npm run dev\`).  
4\. Commit: Git add/commit (include code \+ migration).  
5\. Deploy DB: \`npx supabase db push\`.  
6\. Deploy App: \`git push\` (Vercel auto-deploys).

| Step | Action | Tools | Purpose |  
|------|--------|-------|---------|  
| 1    | Code Feature | Cursor AI | Build logic/UI. |  
| 2    | Create Migration | Supabase CLI \+ AI | Record schema change. |  
| 3    | Test Locally | \`db reset\` \+ App Run | Verify in sandbox. |  
| 4    | Commit | Git | Version control. |  
| 5    | Push Migration | \`db push\` | Update prod schema. |  
| 6    | Push Code | Git Push | Trigger Vercel deploy. |

\#\# 8\. Security and Troubleshooting  
\- \*\*RLS (Row Level Security)\*\*: Enable on tables; define policies in SQL (generate via AI, e.g., "Policy for public read on products"). Default: Deny all.  
\- \*\*Troubleshooting\*\*:  
  \- Paste errors into Cursor chat for explanations/fixes.  
  \- Check Vercel logs for prod issues; use @file for context.  
  \- Common: Confused creds (local vs. prod), missing RLS, connection limits (use pooler).  
\- Best Practices: Never expose service\_role key; use AI to learn/accelerate; practice on small projects.

\#\# 9\. Enhancing AI Assistance for Database Tasks in Cursor and Claude

As a beginner developer relying heavily (95%) on Cursor AI for database setup, changes, and debugging, you can configure your tools to provide more context and autonomy to the LLM. This reduces your manual input by integrating CLIs, extensions, and specialized tools like MCPs (Multi-Context Prompts or similar AI-enhancing plugins/extensions, popular in 2025 for connecting AI to databases). Below are setups for Cursor AI and Claude AI's code terminal/interpreter. These leverage persistent instructions, knowledge bases, and direct DB integrations to make the AI handle more independently.

\#\#\# Cursor AI Configurations  
Cursor's AI can be supercharged for Supabase/Postgres tasks by adding context, extensions, and rules. This allows the AI to reference your project, generate SQL/migrations, debug connections, and even interact with your DB.

1\. \*\*Create a .cursorrules.md File\*\*:  
   \- Place this in your project root. It provides persistent instructions to Cursor's AI for every prompt or edit.  
   \- Example content (copy-paste and customize):  
     \`\`\`  
     \# Cursor Rules for Supabase Database Workflow

     \- Always reference the "Professional Workflow Guide" (supabase-education.md or similar) for best practices on local vs. production separation, migrations, and env vars.  
     \- For database tasks: Use Supabase CLI commands like \`npx supabase migration new\` for schema changes. Generate SQL with Postgres syntax.  
     \- Debug: Check env vars first (process.env), then Docker status, then RLS policies.  
     \- Autonomy: If a task involves DB setup/changes, suggest full code/SQL and CLI steps without assuming user knowledge.  
     \- Context: Assume beginner level; explain steps in plain English. Prioritize safety (e.g., never push to prod without confirmation).  
     \- Integrations: Use supabase-mcp if installed for direct DB queries/management.  
     \`\`\`  
   \- How it helps: AI follows these rules automatically, making responses more contextual and less reliant on your prompts.

2\. \*\*Upload Knowledge Files\*\*:  
   \- In Cursor settings (Cmd/Ctrl \+ Shift \+ P \> "Add to Knowledge"), upload this guide, Supabase docs (download PDFs from supabase.com/docs), and your schema/migrations.  
   \- Use in prompts: Prefix with "@knowledge" or "@supabase-education.md" for AI to reference (e.g., "Using @guide, generate migration for new table").

3\. \*\*Install VS Code Extensions in Cursor\*\*:  
   \- Cursor supports VS Code extensions. Search in Extensions panel (Cmd/Ctrl \+ Shift \+ X):  
     \- \*\*PostgreSQL\*\* (by Chris Kolkman or similar): Syntax highlighting, SQL execution, and connection to local/prod DBs.  
     \- \*\*SQLTools\*\*: Connect to Postgres, run queries, view schemas/tables directly in editor. Configure with your local Supabase creds (host: localhost, port: 54322, user: postgres, pass: postgres).  
     \- \*\*Supabase Extension\*\* (if available, as per 2025 forums): Integrates Supabase dashboard-like features into Cursor for table management.  
     \- \*\*Docker\*\*: For managing containers visually; helps debug local Supabase stack.  
   \- Benefit: AI can suggest using these (e.g., "Run query in SQLTools to test").

4\. \*\*Install and Integrate supabase-mcp\*\*:  
   \- MCPs (e.g., Supabase-MCP from GitHub supabase-community/supabase-mcp) are 2025 tools that connect AI assistants like Cursor to your Supabase project.  
   \- Install: In terminal, \`npm install supabase-mcp \--save-dev\`.  
   \- Setup: Follow GitHub docs to configure with your Supabase keys. It allows AI to autonomously manage tables, query data, fetch configs.  
   \- Usage: In Cursor chat, prompt "Using MCP, query products table" – AI can execute via the integration, reducing your involvement.  
   \- Why: Turns Cursor into an "AI database agent" for tasks like auto-generating queries or schema updates.

5\. \*\*Custom Keybindings and Composer\*\*:  
   \- In Cursor settings \> Keybindings, add shortcuts (e.g., Cmd \+ D for "Debug DB connection" – opens chat with pre-prompt).  
   \- Use Cursor Composer (multi-file editing): Select files, Cmd \+ I, prompt "Apply migration across codebase".

6\. \*\*Terminal Aliases for CLI\*\*:  
   \- In your shell (.zshrc or .bash\_profile): Add aliases like \`alias sb-start='npx supabase start'\` , \`alias sb-reset='npx supabase db reset'\`.  
   \- In Cursor terminal, use these; AI can suggest them in responses.

\#\#\# Claude AI Code Terminal/Interpreter Configurations  
Claude (Anthropic) has a code interpreter for running scripts and a "Projects" feature for context. Use it alongside Cursor for secondary validation or SQL generation.

1\. \*\*Custom Instructions in Claude\*\*:  
   \- In Claude settings (or per-chat), add persistent instructions:  
     \`\`\`  
     You are a Supabase/Postgres expert assisting a beginner. Reference the attached workflow guide for all responses. For DB tasks:  
     \- Generate full SQL/migrations with explanations.  
     \- Suggest CLI commands (e.g., supabase db push) and warn about prod risks.  
     \- Debug: Ask for error logs, then provide fixes.  
     \- Use safe practices: Local first, then prod.  
     \- If MCP integrated, use for direct DB interactions.  
     \`\`\`  
   \- This makes Claude's responses aligned with your guide.

2\. \*\*Claude Projects for Knowledge Base\*\*:  
   \- Create a Project in Claude, upload this guide, Supabase docs, and code snippets.  
   \- In chats: Reference with "Based on project knowledge...".  
   \- Code Interpreter: Run Python scripts for DB interactions (e.g., using psycopg2 to connect/query local Postgres).

3\. \*\*Integrate supabase-mcp with Claude\*\*:  
   \- Similar to Cursor: Install via npm, configure in a script.  
   \- In Claude interpreter: Write/run code that uses MCP to interact with Supabase (e.g., "Query table via MCP").  
   \- Benefit: Claude can simulate or execute DB tasks in sandbox.

4\. \*\*Additional CLIs/Tools for Both\*\*:  
   \- \*\*psql\*\*: Install Postgres CLI (\`brew install postgresql\` on Mac) for direct queries (e.g., \`psql \-h localhost \-p 54322 \-U postgres\` for local Supabase).  
     \- AI can generate commands; run in terminal to give feedback.  
   \- \*\*DBeaver or pgAdmin\*\*: Free GUI tools for DB visualization. Connect to local (localhost:54322) or prod. Upload connection details to AI knowledge for suggestions.  
   \- \*\*n8n or similar automation\*\*: For AI RAG with Supabase (per 2025 guides), but start simple.  
   \- \*\*GitHub Copilot\*\* (if in Cursor): Enable for extra SQL completions.

\#\#\# General Tips for LLM Reliance  
\- \*\*Prompt Engineering\*\*: Always include "As a beginner, explain step-by-step" and reference setups (e.g., "@rules, generate migration").  
\- \*\*Feedback Loop\*\*: After AI suggestion, test locally, paste errors back for debugging.  
\- \*\*Resources\*\*: Watch "Supabase \+ Cursor: 10X Your Database Workflow" on YouTube for visuals. Check supabase-mcp GitHub for updates.  
\- \*\*Safety\*\*: Configure AI rules to always confirm prod changes (e.g., "Ask user before db push").

These setups make your AI tools more self-sufficient, handling 95%+ of DB work with minimal input. Start with .cursorrules and supabase-mcp for immediate impact.

\#\# Conclusion and Instructions for Cursor AI  
Reference this document for all project decisions. Always enforce environment separation, generate migrations/SQL securely, and automate deploys. When prompted, suggest code that uses env vars, RLS, and mirrors prod. Prioritize beginner-friendly explanations and best practices to build confidence. If unclear, ask for clarification based on this guide.  
