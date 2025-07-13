# Beginner Tips: AI-First Development in Cursor AI

This guide offers practical advice for beginners relying heavily on AI (e.g., 95% as mentioned in `@DATABASE-OVERVIEW.md`) to build projects in Cursor AI. It's designed to build confidence, avoid common pitfalls, and maximize tools like Cursor's Chat, Composer, and Knowledge features. Draw from setups in `@GROK-NEW-PROJECT-SETUP.md` and templates like `@PROJECT-OVERVIEW-TEMP.md`. Treat this as a companion to your project docs—revisit it during phases for iterative learning.

Key Principles:
- **AI as Teacher**: Use AI to explain concepts, but verify outputs (e.g., run tests locally).
- **Start Small**: Focus on one phase at a time; celebrate quick wins like a working MVP.
- **Safety First**: Always test locally before prod (ref `@DATABASE-OVERVIEW.md`); question AI assumptions.
- **2025 Mindset**: Leverage Cursor's background agents (for auto-refactoring) and supabase-mcp (for DB autonomy), but understand the basics.

## Getting Started with Cursor AI
1. **Setup Basics**:
   - Install Cursor (cursor.com) and enable Pro for advanced AI (e.g., longer contexts).
   - Open your template repo; run `setup.sh` to bootstrap.
   - Enable extensions: PostgreSQL, SQLTools, Docker, Supabase (for DB viz).

2. **Key Shortcuts**:
   - Cmd/Ctrl + K: Inline code edits/generation.
   - Cmd/Ctrl + L: Chat for questions/explanations.
   - Cmd/Ctrl + I: Composer for multi-file changes (e.g., "Apply theme from @TAN-THEME-RULES.md across components").
   - Cmd/Ctrl + Shift + P: Settings > Add to Knowledge (upload docs like this one as @beginner-tips.md).

3. **Rules and Notepads**:
   - Create `.cursorrules.md` (or User Rules) with project-specific guidelines (ref Step 7 in `@GROK-NEW-PROJECT-SETUP.md`).
   - Use Notepads for quick notes (enable in Beta settings)—attach to prompts for context.

## Prompt Engineering Tips
- **Be Specific**: Instead of "Fix this code", say "Using @project-rules.md, refactor this function to functional style and add TSDoc comments."
- **Reference Docs**: Prefix with @filename.md (e.g., "@tech-stack.md, explain Supabase RLS pros/cons").
- **Chain Prompts**: Start broad ("Recommend stack"), then refine ("Compare alternatives for DB").
- **Ask for Explanations**: Add "As a beginner, explain step-by-step" to every prompt.
- **Handle Errors**: Paste errors into Chat: "Debug this using @DATABASE-OVERVIEW.md: [error log]".

Example Prompt: "Based on @PROJECT-OVERVIEW-TEMP.md, generate project-overview.md for my AI chat app. Ask if details missing."

## Debugging and Iteration Loop
1. **Test Locally First**: Always `npm run dev` and `npx supabase db reset` before pushing.
2. **Feedback Cycle**: Generate code > Test > Paste failures back to AI > Refine.
3. **Common Issues**:
   - Env Var Mixups: Double-check .env.local vs. Vercel dashboard.
   - Flaky Tests: Use retries in e2e (ref `@testing-rules.md`).
   - AI Hallucinations: Cross-verify with docs or web searches if needed.
4. **Iteration**: Update docs as you go (e.g., add risks to `@project-overview.md` after a bug).

## Resources for Learning
- **Videos**: "Cursor AI for Beginners" (YouTube, 2025 series); "Supabase + Cursor: 10X Workflow".
- **Forums**: Reddit r/cursor_ai, Supabase Discord, Stack Overflow (tag cursor-ai).
- **Docs**: Cursor Help (cursor.com/docs), Supabase Guides (supabase.com/docs).
- **Practice**: Start with small projects—clone templates and tweak.

| Tip Category | Quick Advice | Why It Helps |
|--------------|--------------|-------------|
| AI Reliance | Limit to 1-2 tools per prompt. | Avoids overwhelming outputs. |
| Security | Confirm prod changes (e.g., "Ask before db push"). | Prevents data loss (ref `@DATABASE-OVERVIEW.md`). |
| Performance | Use Lighthouse audits post-deploy. | Ensures mobile-first speed. |
| Mindset | Question AI: "Why this over alternative?" | Builds expertise. |

## Next Steps
- Follow `@GROK-NEW-PROJECT-SETUP.md` sequentially.
- After MVP, deploy (ref `@deployment-guide.md`) and test in prod.
- Review this after each phase—update with your learnings.
- If stuck: Prompt "Using @beginner-tips.md, help debug [issue]." 

Remember, AI accelerates learning—embrace mistakes as teachers!