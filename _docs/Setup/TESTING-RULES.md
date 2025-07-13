# Testing Rules Template Guide for LLMs

This markdown document serves as a general template and guide for large language models (LLMs) to generate a high-quality `testing-rules.md` file for any new project. The `testing-rules.md` outlines the testing strategy, tools, conventions, and best practices to ensure code reliability, maintainability, and quality. It builds upon documents like `project-overview.md`, `tech-stack.md`, `project-rules.md`, and `phases/` docs, and helps prevent bugs in AI-generated codebases.

As an LLM, use this guide to create thorough, practical, and project-specific testing rules based on user input. Avoid assumptions—reference provided details and ask clarifying questions if needed (e.g., "What testing coverage target? Focus on frontend or full-stack?"). Aim for brevity (400-800 words) with code snippets for implementation. Ensure rules promote test-driven development (TDD), accessibility testing, and integration with CI/CD.

## Key Principles for a Great Testing Rules Document
A strong `testing-rules.md` should:
- **Promote Reliability**: Cover unit, integration, and end-to-end (e2e) tests to catch issues early.
- **Be Scalable**: Define coverage goals (e.g., 80%+) and automate via CI/CD.
- **Align with Project Goals**: Tailor to app type (e.g., more e2e for UI-heavy apps) from `project-overview.md`.
- **Incorporate Best Practices**: Use mocking for externals (e.g., APIs), snapshot testing, and accessibility checks (e.g., axe-core).
- **Be Actionable**: Include examples for the tech stack (e.g., Jest for React) and pitfalls (e.g., flaky tests).
- **Encourage Iteration**: Integrate testing into phases (e.g., MVP requires core tests).

Common pitfalls to avoid:
- Over-testing (e.g., 100% coverage isn't always practical—focus on critical paths).
- Ignoring Edge Cases (e.g., always include error handling tests).
- Tool Assumptions (e.g., confirm from `tech-stack.md` if using Jest vs. Vitest).
- Lack of Automation (e.g., require git hooks for pre-commit tests).

## Recommended Structure
Structure the `testing-rules.md` with the following sections. Use markdown formatting for clarity (e.g., # for headers, - for lists, ```code blocks for examples, | for tables). Populate based on project context and tech stack.

### 1. Testing Overview
- Provide a title and 1-2 paragraph summary.
- Include: Strategy rationale (e.g., TDD for AI-first code), coverage goals, and integration with development workflow.
- Example:  
  "# Testing Rules: Comprehensive TDD Approach  
  This document defines our testing strategy to ensure robust, bug-free code in our AI-powered web app. We adopt TDD with 80%+ coverage, focusing on unit tests for logic, integration for components, and e2e for user flows. Tools align with [tech-stack.md], emphasizing automation via CI/CD to catch issues early."

### 2. Testing Types and Coverage
- Define key test types: Unit (isolated functions), Integration (components/services), e2e (full flows), Snapshot (UI consistency), Accessibility (WCAG compliance).
- Specify targets: e.g., 90% unit, 70% integration.
- Example Table:

  | Test Type | Description | Coverage Goal | Tools/Examples |
  |-----------|-------------|---------------|---------------|
  | Unit | Test individual functions/logic. | 90% | Jest/Vitest: Test utils/helpers. |
  | Integration | Test component interactions. | 70% | React Testing Library: Mock API calls. |
  | e2e | Simulate user journeys. | Key flows only | Cypress/Playwright: Login to dashboard. |
  | Accessibility | Check WCAG compliance. | All UI components | axe-core: Integrated in unit tests. |

### 3. Tools and Setup
- List tools from `tech-stack.md` (e.g., Jest, Vitest, React Testing Library, Cypress).
- Include installation, config, and best practices (e.g., mocking Supabase with MSW).
- Example:
  - Primary: Jest for JS/TS; Addons: @testing-library/react, msw.
- Code Example (package.json scripts):
  ```json
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
  ```

### 4. Conventions and Best Practices
- Naming: Descriptive (e.g., `sum.test.ts`); Structure: Colocate tests with code.
- Patterns: Arrange-Act-Assert; Mock externals; Use data-testid sparingly.
- Automation: Husky pre-commit hooks; GitHub Actions for CI.
- Example List:
  - Write tests before code (TDD).
  - Mock APIs/databases for isolation.
  - Run coverage reports regularly.

### 5. Common Pitfalls and Mitigations
- Identify 4-6 issues (e.g., flaky e2e tests—mitigate with retries; over-mocking—use real integrations where safe).
- Example Bullet Points:
  - Pitfall: Slow tests—Mitigation: Parallelize with --workers.
  - Pitfall: Ignoring async—Mitigation: Use await/expect.async.

### 6. Integration with Phases
- Link to `phases/` (e.g., Setup: Install tools; MVP: Core tests; Enhancements: e2e).
- Example: Require 100% passing tests before merging.

### 7. References and Next Steps
- Link to docs (e.g., `project-rules.md` for code style in tests).
- Suggest tools: Coverage reports in VS Code; Audit with SonarQube.

## How to Generate as an LLM
1. **Gather Input**: Prompt for details (e.g., "Coverage goals? Preferred tools? Focus areas like UI or backend?").
2. **Customize**: Tailor to tech stack (e.g., Vitest for Vite; Cypress for e2e) and project type (e.g., more accessibility for web apps).
3. **Validate**: Cross-reference with `tech-stack.md` for tools and `project-rules.md` for style (e.g., functional patterns in tests).
4. **Output Format**: Always output as a standalone markdown file, starting with the title header.
5. **Iterate**: If feedback is given, refine (e.g., add more e2e examples).

Example Prompt for You (as LLM): "Using this template, create testing-rules.md for a [project description] with [tech preferences]."