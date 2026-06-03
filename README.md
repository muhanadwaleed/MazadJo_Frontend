# MazadJo Frontend Monorepo

Two Next.js apps sharing `@mazad/*` packages:

| App | Port | Purpose |
|-----|------|---------|
| `@mazad/web` | 3000 | Public site (auctions, sellers, auth) |
| `@mazad/admin` | 3001 | Staff operations console |

## Setup

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

Ensure Django CORS includes both origins:

```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Development

```bash
# Both apps
npm run dev

# Public only
npm run dev:web

# Staff only
npm run dev:admin
```

Backend API: http://localhost:8000
