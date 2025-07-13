# API Rules Template Guide for LLMs

This markdown document serves as a general template and guide for large language models (LLMs) to generate a high-quality `api-rules.md` file for any new project, especially API-heavy ones. The `api-rules.md` defines conventions for designing, implementing, and securing APIs (e.g., REST, GraphQL, or edge functions). It builds upon documents like `project-overview.md`, `tech-stack.md`, `database-overview.md`, and `project-rules.md`, ensuring APIs are scalable, secure, and maintainable.

As an LLM, use this guide to create practical, secure, and project-specific API rules based on user input. Avoid assumptions—reference provided details and ask clarifying questions if needed (e.g., "REST or GraphQL? Auth method?"). Aim for brevity (400-800 words) with code snippets for implementation. Emphasize security (e.g., RLS from Supabase) and integration with testing/deployment.

## Key Principles for a Great API Rules Document
A strong `api-rules.md` should:
- **Promote Security**: Default to auth, rate limiting, and input validation.
- **Be Consistent**: Use semantic naming, versioning, and error formats.
- **Align with Project Goals**: Tailor to flows (e.g., from `user-flow.md`) and stack (e.g., Supabase edge functions).
- **Incorporate Best Practices**: Follow RESTful/GraphQL principles; handle errors gracefully; optimize for performance.
- **Be Implementable**: Include examples for the tech stack (e.g., Next.js API routes).
- **Encourage Iteration**: Integrate with phases (e.g., MVP APIs first).

Common pitfalls to avoid:
- Insecure Defaults (e.g., no RLS—always enable).
- Over-Complexity (e.g., limit endpoints; use pagination).
- Lack of Examples (e.g., show auth flows).
- Assumptions about Type (e.g., confirm REST vs. GraphQL from `tech-stack.md`).

## Recommended Structure
Structure the `api-rules.md` with the following sections. Use markdown formatting for clarity (e.g., # for headers, - for lists, ```code blocks for examples, | for tables). Populate based on project context.

### 1. API Overview
- Provide a title and 1-2 paragraph summary.
- Include: API type (e.g., REST), purpose, and ties to project (e.g., secure data access via Supabase).
- Example:  
  "# API Rules: Secure RESTful Endpoints  
  This document outlines rules for our REST APIs, focusing on authentication, error handling, and integration with Supabase. APIs enable core features like user data retrieval, aligning with [user-flow.md]. Built for Next.js routes with JWT auth."

### 2. API Design Principles
- Define style: REST (CRUD endpoints), GraphQL (queries/mutations), or hybrid.
- Principles: Stateless, versioned (e.g., /api/v1/), paginated, cached where possible.
- Example List:
  - Use HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).
  - Return JSON; status codes: 200 OK, 201 Created, 400 Bad Request, etc.

### 3. Naming and Structure Conventions
- Endpoints: Kebab-case (e.g., /api/users/profile); Semantic (e.g., /users/{id}/orders).
- Query Params: Snake_case (e.g., ?sort_by=date).
- Request/Response: JSON schemas; Use DTOs for validation.
- Example Table:

  | Convention | Example | Rationale |
  |------------|---------|-----------|
  | Endpoint | /api/v1/users/{id} | Resource-based, versioned. |
  | Params | ?page=1&limit=20 | Pagination for large datasets. |
  | Headers | Authorization: Bearer {token} | JWT for auth. |

### 4. Authentication and Security
- Methods: JWT (Supabase), API keys; Enforce RLS on DB queries.
- Best Practices: Validate inputs (e.g., Zod), rate limit, CORS.
- Example:
  - Always check auth: Use Supabase's `supabase.auth.getUser()`.
- Code Example (Next.js API Route):
  ```typescript
  import { createClient } from '@supabase/supabase-js';

  export async function GET(request: Request) {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('Unauthorized', { status: 401 });
    // Proceed with query
  }
  ```

### 5. Error Handling
- Standard Format: { error: string, code: number, details?: object }.
- Common Errors: 400 (validation), 401 (unauth), 404 (not found), 500 (server).
- Logging: Use console.error; Integrate Sentry for prod.
- Example Response:
  ```json
  {
    "error": "Invalid input",
    "code": 400,
    "details": { "field": "email" }
  }
  ```

### 6. Performance and Optimization
- Caching: Use headers (e.g., Cache-Control).
- Pagination: Limit results; Use cursors for large sets.
- Monitoring: Track with Vercel Analytics.

### 7. Integration with Phases and Testing
- Phases: Setup (mock APIs), MVP (core endpoints), Enhancements (optimization).
- Testing: Unit for handlers, integration for auth (ref `@testing-rules.md`).
- Example: Require API tests with MSW for mocking.

### 8. References and Next Steps
- Link to docs (e.g., `database-overview.md` for RLS).
- Suggest tools: Postman for testing; OpenAPI for docs.

## How to Generate as an LLM
1. **Gather Input**: Prompt for details (e.g., "API type? Auth needs? Endpoints from user-flow?").
2. **Customize**: Tailor to stack (e.g., edge functions for Vercel) and project (e.g., secure for data apps).
3. **Validate**: Cross-reference with `tech-stack.md` for tools and `database-overview.md` for Supabase.
4. **Output Format**: Always output as a standalone markdown file, starting with the title header.
5. **Iterate**: If feedback is given, refine (e.g., add GraphQL examples).

Example Prompt for You (as LLM): "Using this template, create api-rules.md for a [project description] with [API preferences]."