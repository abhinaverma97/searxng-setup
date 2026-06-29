# vexa

A search API designed for AI agents. Raw search, AI summaries, and deep research — all through a single API key.

Stack: Next.js 16, TypeScript, SearXNG, Groq (llama-3.3-70b), SQLite via Prisma 7.

## Architecture

```
Agent → API Key → Next.js → SearXNG (Docker) → Web
                         ↘ Groq AI → summaries / deep research
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/search` | Raw SearXNG results |
| `POST /api/search/analyze` | Results + Groq AI summary |
| `POST /api/search/deep` | SSE stream — 3-round multi-step research |
| `POST /api/search/demo` | Unauthenticated demo (rate-limited) |

## Quick Start

```bash
# Start SearXNG
docker compose up -d core

# Install deps and run dev server
pnpm install
pnpm dev
```

Set up `.env.local` with your keys (see `.env.example`).

## Deployment

```bash
docker compose up -d --build
```

Behind Caddy for TLS (configured on the server, not in this repo).

## Development

```bash
pnpm dev        # dev server
pnpm test       # 20 unit tests
pnpm build      # production build
pnpm lint       # eslint
```
