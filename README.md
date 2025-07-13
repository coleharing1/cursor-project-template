# TodoList Web App

A powerful task management application designed for busy professionals, entrepreneurs, and creative thinkers who juggle multiple life domains.

## 🎯 Why TodoList?

**TodoList** solves the fragmentation problem of managing tasks across different areas of life. Instead of switching between multiple apps or lists, TodoList provides:

- **Unified Task Management**: View all tasks from different categories (work, personal, creative projects) in one centralized location
- **Smart Daily Focus**: Select tasks from any list into a focused daily view with 1-2 clicks, reducing planning time by 50%
- **Automatic Progress Tracking**: Completed tasks are automatically logged with timestamps and statistics for motivation and accountability
- **Hierarchical Organization**: Support for big ideas with subtasks and custom categories with colors/icons
- **Seamless Experience**: Optimistic UI updates, real-time sync, and daily automatic resets for unfinished focus tasks

## ✨ Key Features

- **All Tasks View** - Hierarchical accordions organized by headers and categories with expand/collapse functionality
- **Today's Focus List** - Quick selection from any list, manual ad-hoc additions, automatic daily reset at midnight
- **Task Management** - Create/edit/delete tasks with title, description, priority, duration, due date, tags, and parent task support
- **Category System** - Custom categories with colors and icons for better organization
- **Historical Log** - Date-grouped completion history at `/log` with statistics and progress tracking
- **Search & Filter** - Global task search, filter by tags/priority/due date, show/hide completed tasks
- **Real-time Updates** - Optimistic UI with immediate feedback and background sync
- **Responsive Design** - Mobile-first approach for seamless experience across devices

## 🛠️ Tech Stack

### Frontend
- **TypeScript** - Type-safe development with better IDE support
- **Next.js 15 (App Router)** - Full-stack React framework with SSR/SSG
- **React** - Component-based UI with hooks
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Accessible component library built on Radix UI

### Backend & Database
- **Supabase** - PostgreSQL-based BaaS with auth, real-time, and RLS
- **Edge Functions** - Server-side logic for scheduled tasks

### Development & Testing
- **Vitest** - Fast unit/integration testing
- **React Testing Library** - User-centric component testing
- **Playwright** - End-to-end testing
- **Docker** - Local development environment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker (for local Supabase)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd TodoList
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Optional: For production
   DATABASE_URL=your_database_url
   ```

4. **Initialize Supabase (local development)**
   ```bash
   ./setup.sh
   ```
   This script:
   - Starts Supabase locally using Docker
   - Runs database migrations
   - Sets up Row Level Security policies

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

### Database Setup

For production or remote Supabase:
1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations: `npx supabase db push`
3. Enable Row Level Security on all tables
4. Update `.env.local` with your project credentials

## 📁 Project Structure

```
todolist/
├── app/                 # Next.js App Router pages and API routes
├── components/          # Reusable UI components
├── lib/                 # Utilities, hooks, and Supabase client
├── types/              # TypeScript type definitions
├── tests/              # Test files (colocated or dedicated)
├── supabase/           # Database migrations and config
└── _docs/              # Comprehensive project documentation
```

## 🧩 Development Guidelines

### Code Style
- **Functional Programming**: No classes, use hooks and composition
- **Error Handling**: Throw errors for better debugging
- **File Size**: Keep files under 500 lines for maintainability
- **TypeScript**: Strict mode enabled with proper typing

### Naming Conventions
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Functions: Descriptive (e.g., `fetchUserTasks`)
- Booleans: Prefixed (e.g., `isTaskFocused`, `hasCompletedTasks`)

### Best Practices
- Use TSDoc comments for documentation
- Implement optimistic UI updates
- Follow React hooks rules
- Ensure accessibility (WCAG 2.1 AA)

## 🧪 Testing

### Run Tests
```bash
npm run test        # Unit tests with Vitest
npm run test:e2e    # E2E tests with Playwright
npm run test:coverage # Coverage report
```

### Testing Strategy
- Unit tests for business logic and utilities
- Integration tests for API routes
- E2E tests for critical user flows
- Minimum 80% coverage for core features

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic preview URLs for PRs

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following our conventions
3. Write/update tests
4. Submit PR with description and linked issues

### Commit Convention
Use semantic commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process/auxiliary changes

### Pull Request Guidelines
- Reference related documentation (e.g., `@mvp-phase.md`)
- Include test coverage
- Ensure all checks pass
- Request review from maintainers

## 📚 Documentation

Comprehensive documentation is available in the `_docs/` directory:
- [Project Overview](_docs/project-overview.md) - Vision and objectives
- [User Flows](_docs/user-flow.md) - Detailed user journeys
- [Tech Stack](_docs/tech-stack.md) - Technology decisions
- [Project Rules](_docs/project-rules.md) - Development conventions
- [Feature Checklist](_docs/key-features-checklist.md) - Implementation tracking

## 📄 License

[License Type] - See LICENSE file for details

## 🙏 Acknowledgments

Built with modern web technologies and best practices for 2025.