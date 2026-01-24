# Sentry Toolbar

React/TypeScript library that embeds in web apps to provide quick access to Sentry data (issues, replays, feature flags, feedback).

## Stack
- React 19 + TypeScript (strict mode)
- Vite 7, pnpm 10.26.2
- Tailwind CSS + CSS modules
- TanStack Query for server state
- Jest + React Testing Library

## Structure
- `src/lib/` - Published library code
  - `components/` - React components (base UI, icons, panels)
  - `sentryApi/` - API client and types
  - `hooks/`, `context/`, `utils/`
- `src/env/demo/` - Local development demo

## Non-Negotiable Rules

**Error Handling**
- Never silently catch errors. Always log or show user feedback.
- Bad: `catch (e) {}`
- Good: `catch (e) { console.error('Failed:', e); showToast('error'); }`

**API Calls**
- Use TanStack Query for all API calls
- Handle loading, error, empty, and success states
- Show loading indicators and user-friendly error messages

**Async Operations**
- Disable UI during async operations to prevent double-submission
- Always handle promise rejections
- Clean up useEffect hooks properly

## Code Style

**TypeScript**
- Avoid `any` - use `unknown` with type guards
- Export types with components: `interface ComponentProps`

**React**
- Function components only
- Props interface: `{ComponentName}Props`
- Extract reusable logic to custom hooks

**Styling**
- Tailwind first, CSS modules for component-specific styles
- Mobile-first responsive design

**Testing**
- Test user behavior, not implementation
- `.spec.ts` or `.test.ts` files

## Git & Commits
- Branch: `username/description` (e.g., `ryan953/fix-login`)
- Main branch: `main`
- Conventional commits: `feat:`, `fix:`, `refactor:`, etc.

## Commands
```bash
pnpm dev                  # Dev server with watch
pnpm dev:standalone       # Standalone demo
pnpm build                # Production build
pnpm test                 # Run tests
pnpm lint:code            # ESLint
pnpm lint:types           # TypeScript check
pnpm start:docs           # Storybook (port 6006)
```

## Architecture Notes
- Runs in Shadow DOM (isolated from host app CSS)
- OAuth authentication with Sentry
- Loads via CDN or npm package
