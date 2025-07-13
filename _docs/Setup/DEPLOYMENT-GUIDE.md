# Deployment Guide: Vercel and Supabase for Full-Stack Web Apps

This guide provides a step-by-step process for deploying your project to production using Vercel (for hosting) and Supabase (for database and auth). It emphasizes environment separation, automation, and best practices as of July 2025. Reference this during the "Enhancements" phase or post-MVP to ensure reliable, scalable deploys. Builds on `@DATABASE-OVERVIEW.md` for DB workflows and `@tech-stack.md` for tools like Next.js.

Key Principles:
- **Local vs. Prod Parity**: Mirror setups to avoid "works on my machine" issues.
- **Automation-First**: Use Git pushes for CI/CD; env vars for secrets.
- **Security**: Never commit credentials; enable RLS and Vercel's protections.
- **2025 Updates**: Leverage Vercel's AI-optimized deploys (e.g., auto-scaling for edge functions) and Supabase's enhanced poolers (reduced latency by 20% in recent benchmarks).

## Prerequisites
- GitHub repo with your project (from template).
- Accounts: Vercel (free tier), Supabase (free tier), GitHub.
- Tools: Vercel CLI (`npm i -g vercel`), Supabase CLI (installed via `npm`).
- Local setup complete (e.g., `setup.sh` run, tests passing).

## Step 1: Prepare Your Project
1. **Env Vars**: Copy `.env.local.example` to `.env.local` (gitignore'd). For prod, use dashboard vars.
   - Example (.env.local):
     ```
     NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-key
     ```
2. **DB Migrations**: Ensure schema is versioned (ref `@DATABASE-OVERVIEW.md` Phase 3).
3. **Build Config**: For Next.js, add `vercel.json` if needed (e.g., for routes).
4. **Testing**: Run `npm test`—deploys should fail on test errors via CI.

## Step 2: Set Up Production Supabase
(From `@DATABASE-OVERVIEW.md` Phase 1)
1. Create project on supabase.com.
2. Get creds: URL, ANON_KEY (client), SERVICE_ROLE_KEY (server).
3. Enable RLS on tables.
4. Link local: `npx supabase link --project-ref your-ref`.
5. Push migrations: `npx supabase db push` (after local testing).

## Step 3: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`.
2. Link project: `vercel` (follow prompts; connect GitHub repo).
3. Add Env Vars in Vercel Dashboard > Settings > Environment Variables:
   - Scope to Production: `NEXT_PUBLIC_SUPABASE_URL=your-prod-url`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`.
   - Use Pooler for connections: Set to Transaction Mode to avoid limits.
4. Deploy: `git push` triggers auto-deploy (Preview on branches, Prod on main).
   - Manual: `vercel --prod`.

Workflow Checklist:

| Step | Action | Tools | Notes |
|------|--------|-------|-------|
| 1 | Push code to GitHub | Git | Triggers Vercel build. |
| 2 | Build & Deploy App | Vercel | Auto-handles Next.js SSR/SSG. |
| 3 | Push DB Changes | Supabase CLI | `db push` after `db reset` local test. |
| 4 | Monitor | Vercel Logs/Dashboard | Check for errors; use Real-Time Logs. |

## Step 4: CI/CD Automation
1. Add GitHub Actions: Create `.github/workflows/deploy.yml`.
   - Example (basic):
     ```yaml
     name: Deploy to Vercel
     on: [push]
     jobs:
       deploy:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
           - name: Install Dependencies
             run: npm ci
           - name: Run Tests
             run: npm test
           - name: Deploy
             uses: amondnet/vercel-action@v25
             with:
               vercel-token: ${{ secrets.VERCEL_TOKEN }}
               vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
               vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
     ```
2. Secrets: Add to GitHub Repo Settings > Secrets: VERCEL_TOKEN, etc.
3. For Supabase: Add a job for `db push` (use secrets for project-ref).

## Step 5: Troubleshooting and Optimization
- **Common Issues**:
  - Connection Errors: Use Pooler (Transaction Mode) for serverless; check env vars.
  - Build Failures: Ensure Node version matches (e.g., 20+ for Next.js 15).
  - Latency: Enable Supabase Edge Functions; Vercel's AI deploys auto-optimize.
- **Monitoring**: Vercel Analytics for perf; Supabase Dashboard for queries.
- **Scaling**: Set auto-scaling in Vercel; use Supabase's read replicas for high traffic.
- **Pitfalls**: Mixing local/prod creds—always use env vars; forgetting RLS—enable by default.

## 2025 Best Practices
- Vercel AI Deploys: Enable for auto-code fixes during builds (beta as of May 2025).
- Security: Use Vercel's WAF; Supabase's JWT for auth.
- Cost: Monitor usage—Vercel free for <1GB bandwidth; Supabase scales via compute credits.
- Rollbacks: Vercel auto-creates previews; revert via Git.

## References and Next Steps
- Related Docs: `@DATABASE-OVERVIEW.md` for DB details; `@tech-stack.md` for Vercel integration.
- Tools: Vercel Docs (vercel.com/docs); Supabase Deploy Guide.
- Next: Set up monitoring (e.g., Sentry); Test prod flows; Optimize for SEO if web app.