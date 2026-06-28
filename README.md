# SearXNG Setup

Self-hosted SearXNG instance with AI-powered search API for agents.

- **SearXNG** — lean 6-engine meta-search, no API keys needed
- **Agent API** — FastAPI service with raw search + Groq-powered AI analysis
- **One command** to run everything

## Quick Start

```bash
docker compose up -d
```

### Services

| Service | URL | Description |
|---------|-----|-------------|
| SearXNG | http://127.0.0.1:8888 | Search engine web UI |
| Agent API | http://127.0.0.1:8000 | API for AI agents |
| API docs | http://127.0.0.1:8000/docs | Swagger UI |

### Agent API Endpoints

```bash
# Raw search results
curl "http://127.0.0.1:8000/search?q=your+query"

# AI-analyzed results (via Groq llama-3.3-70b)
curl "http://127.0.0.1:8000/search/analyzed?q=your+query"

# Health check
curl "http://127.0.0.1:8000/health"
```

## Configuration

Set your Groq API key in `.env`:

```
GROQ_API_KEY=gsk_...
```

Edit `config/settings.yml` for search engine config, then restart:

```bash
docker compose restart core
```

## Benchmark

```bash
python scripts/benchmark.py
```

Requires Python 3 and `curl.exe` (pre-installed on Windows).

## Stats

| Metric | Value |
|--------|-------|
| Working engines | 6 |
| Avg response time | 0.5–1.4s |
| Results/query | 8–10 |

## Engines

| Engine | Timeout | Weight | Avg time |
|--------|---------|--------|----------|
| bing | 2.0s | 3 | 0.52s |
| vuhuv | 5.0s | 2 | 0.82s |
| privacywall | 5.0s | 2 | 0.99s |
| yandex | 2.0s | 2 | 1.13s |
| dogpile | 3.0s | 2 | 1.17s |
| gmx | 2.0s | 1 | 1.35s |

## Project Structure

```
├── api/
│   ├── Dockerfile          FastAPI container
│   ├── main.py             App entry + endpoints
│   ├── search_client.py    SearXNG API client
│   ├── analyzer.py         Groq AI analysis
│   └── requirements.txt
├── config/
│   └── settings.yml        Engine configuration
├── scripts/
│   └── benchmark.py        Benchmarking script
├── docker-compose.yml      Docker Compose definition
├── .env.example            Environment template
├── .env                    Environment variables (gitignored)
├── .gitignore
└── README.md
```

## Related

- [config/settings.yml](config/settings.yml) — engine configuration
- [scripts/benchmark.py](scripts/benchmark.py) — benchmarking script
- [api/main.py](api/main.py) — API entry point
