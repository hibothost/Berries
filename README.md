# Berries

A modern full-stack application for UI component prototyping and management with a robust backend API.

## Quick Start

### Prerequisites
- Node.js 24+
- pnpm

### Installation & Development

```bash
# Install dependencies
pnpm install

# Run the API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Run full typecheck across all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Regenerate API hooks and Zod schemas from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push database schema changes (dev only)
pnpm --filter @workspace/db run push
```

### Environment Variables

Required for development:
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/berries`)
- `PORT` - Port for services (default: 3000 for mockup-sandbox, 5000 for api-server)
- `BASE_PATH` - Base path for web serving (default: `/`)

For Render deployments, ensure `PORT` and `BASE_PATH` are set in environment variables.

## Project Structure

```
berries/
├── artifacts/
│   ├── api-server/          # Express.js REST API
│   ├── berries-app/         # Mobile/app variant
│   ├── berries-web/         # Web application
│   └── mockup-sandbox/      # Vite + React UI component preview system
├── lib/
│   ├── api-spec/            # OpenAPI specification
│   ├── api-zod/             # Zod schema generation from OpenAPI
│   ├── api-client-react/    # React hooks for API calls
│   └── db/                  # Database schema & Drizzle ORM
├── scripts/                 # Workspace utilities
├── package.json             # Workspace root
├── pnpm-workspace.yaml      # pnpm workspace config
└── tsconfig.base.json       # Shared TypeScript config
```

## Tech Stack

### Core
- **Runtime:** Node.js 24, TypeScript 5.9
- **Package Manager:** pnpm
- **Monorepo:** pnpm workspaces

### Backend
- **Server:** Express 5
- **Database:** PostgreSQL + Drizzle ORM
- **Validation:** Zod v4
- **Authentication:** Clerk

### Frontend
- **Framework:** React 19.1.0
- **Build Tool:** Vite 7.3.2
- **UI Components:** Radix UI, shadcn/ui
- **Styling:** Tailwind CSS 4.1.14, Framer Motion
- **State Management:** React Query 5
- **Forms:** React Hook Form
- **Routing:** Wouter
- **Icons:** Lucide React
- **Toasts:** Sonner

### Code Generation & Tooling
- **API Codegen:** Orval (from OpenAPI spec)
- **Build:** esbuild (CJS bundle)

## Key Features

### Mockup Sandbox
A sophisticated UI component preview system:
- **Auto-discovery** of React components in `src/components/mockups/`
- **Dynamic component loading** with preview rendering
- **Hot module reloading** during development
- **Component gallery** with routing support
- Uses custom Vite plugin for component generation

### API Architecture
- OpenAPI specification-first design
- Automatic TypeScript client generation
- Zod schema validation
- RESTful endpoints with Clerk authentication

### Database
- Drizzle ORM for type-safe queries
- PostgreSQL backend
- Easy schema migration with `pnpm --filter @workspace/db run push`

## Development Workflow

### 1. Making Database Changes
```bash
# Edit schema in lib/db/src/schema.ts
pnpm --filter @workspace/db run push
```

### 2. Updating API Contracts
```bash
# Edit OpenAPI spec in lib/api-spec/
pnpm --filter @workspace/api-spec run codegen
```

### 3. Building for Production
```bash
# Full build with typecheck
pnpm run build

# Or just the API server
pnpm run build:server
```

### 4. Type Checking
```bash
# Check workspace libraries only
pnpm run typecheck:libs

# Full workspace typecheck
pnpm run typecheck

# API server only
pnpm run typecheck:server
```

## Architecture Decisions

### Monorepo Strategy
Using pnpm workspaces for:
- **Code sharing** across frontend and backend
- **Type safety** with shared TypeScript config
- **Unified versioning** and dependency management
- **Isolated build targets** for different deployment contexts

### Frontend Choices
- **Vite** over Next.js for mockup-sandbox to enable custom component discovery
- **Tailwind CSS v4** for modern CSS-in-JS approach
- **Radix UI** for unstyled, accessible components
- **shadcn/ui** for styled component templates

### Backend Strategy
- **Express 5** for lightweight, modular API
- **Drizzle ORM** for type-safe database operations
- **Zod** for runtime validation and type inference
- **OpenAPI-first** for API contract definition

### Supply Chain Security
- Minimum 1-day release age for npm packages (defense against supply-chain attacks)
- Exceptions only for trusted organizations (@replit/*, stripe-replit-sync)
- See `pnpm-workspace.yaml` for configuration

## Deployment

### Render Deployment
The project is configured for Render with:
- Node.js 24 runtime
- pnpm package manager
- Build command: `pnpm install --frozen-lockfile && pnpm -r --if-present run build`

**Important:** Set these environment variables in Render:
- `PORT` - 3000 (or your chosen port)
- `BASE_PATH` - `/` (or your deployment path)
- `DATABASE_URL` - Your PostgreSQL connection string

### Troubleshooting Render Builds
If `mockup-sandbox` build fails:
1. Ensure `PORT` and `BASE_PATH` environment variables are set
2. Check that PostgreSQL is accessible if using database
3. Review build logs for specific Vite/Tailwind errors

## Contributing

### Code Style
- TypeScript strict mode enabled
- ESLint configuration per workspace
- Prettier formatting (run before commit)

### Testing
- Components have optional test files (`.test.ts`)
- Run tests per package as configured

### Commits
- Follow conventional commits if applicable
- Include package scope if workspace-specific

## Resources

- **OpenAPI Spec:** See `lib/api-spec/` for API contracts
- **Database Schema:** See `lib/db/src/schema.ts`
- **Type Definitions:** Shared in root `tsconfig.base.json`
- **Replit Setup:** See `.replit` for Replit-specific configuration

## License

MIT

## Links

- **Live Preview:** [Berry Coin Connect on Replit](https://replit.com/@kiizashamim5/Berry-Coin-Connect)
- **Repository:** https://github.com/hibothost/Berries
