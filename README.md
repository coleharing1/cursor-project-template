# Cursor Project Template

[![GitHub stars](https://img.shields.io/github/stars/coleharing1/cursor-project-template?style=social)](https://github.com/coleharing1/cursor-project-template/stargazers) [![GitHub forks](https://img.shields.io/github/forks/coleharing1/cursor-project-template?style=social)](https://github.com/coleharing1/cursor-project-template/network/members)

A streamlined template for bootstrapping AI-assisted full-stack web projects in Cursor AI (as of July 2025). This repo provides a documentation-first workflow, templates for key project docs, and rules for building modular, scalable codebases optimized for AI tools. Ideal for beginners relying on AI (e.g., 95% automation) to create production-grade apps with Next.js, Supabase, Vercel, and more.

## Features
- **Documentation-Led Setup**: Sequential guides to generate core docs (e.g., project-overview.md, user-flow.md, tech-stack.md) via AI prompts.
- **AI-First Principles**: Files <500 lines, descriptive names/JSDoc, functional patterns, no classes—maximizes compatibility with Cursor's Chat/Composer.
- **Templates and Examples**: Ready-to-use templates for overviews, themes (e.g., Tan Earthy Minimalist), APIs, testing, deployment, and project rules.
- **Checklists and Trackers**: Instructional files for key features, pages/URLs status, and project history logs to monitor progress.
- **2025 Integrations**: Supabase-mcp for AI-DB autonomy, Cursor background agents, WCAG 2.2 accessibility, and security mitigations.
- **Workflow Enhancements**: Setup scripts, agent rules examples, and phase-based iterative development.

## Getting Started
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/coleharing1/cursor-project-template.git
   cd cursor-project-template
   ```
2. **Run Setup Script**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   This installs dependencies, initializes Supabase (if needed), and starts the local stack.
3. **Open in Cursor AI**: Launch Cursor and enable Knowledge uploads (e.g., add key docs like @GROK-NEW-PROJECT-SETUP.md).
4. **Follow the Guide**: Start with GROK-NEW-PROJECT-SETUP.md for step-by-step prompts to generate your project's docs.

Prerequisites: Cursor AI (Pro recommended), Docker (for Supabase), Git, npm.

## Usage
- **Generate Docs**: Use prompts in GROK-NEW-PROJECT-SETUP.md (e.g., for project-overview.md).
- **Build Iteratively**: Create phase docs in _docs/phases/ and implement features.
- **Track Progress**: Update checklists (e.g., key-features-checklist.md) and history log.
- **Customize Rules**: Adapt .cursorrules.md or User Rules for your stack.
- **Deploy**: Follow DEPLOYMENT-GUIDE.md for Vercel/Supabase setups.

For detailed workflows, see:
- [GROK-NEW-PROJECT-SETUP.md](GROK-NEW-PROJECT-SETUP.md): Main guide.
- [DATABASE-OVERVIEW.md](DATABASE-OVERVIEW.md): Supabase local/prod separation.
- [PROJECT-RULES-TEMP.md](PROJECT-RULES-TEMP.md): Code style template.

## Contributing
Contributions welcome! Fork the repo, create a branch, and submit a PR. Follow the rules in PROJECT-RULES-TEMP.md. For issues, use GitHub Issues.

## License
MIT License. See [LICENSE](LICENSE) for details.

---
Built for AI-driven development—fork and adapt for your next project! 
