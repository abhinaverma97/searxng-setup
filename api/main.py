from fastapi import FastAPI, Query
from search_client import search as search_raw
from analyzer import analyze

app = FastAPI(title="SearXNG Agent API", version="0.1.0")


@app.get("/search")
async def search_endpoint(
    q: str = Query(..., description="Search query"),
    limit: int = Query(10, ge=1, le=50),
):
    results = await search_raw(q, limit)
    return {"query": q, "results": results}


@app.get("/search/analyzed")
async def search_analyzed(
    q: str = Query(..., description="Search query"),
    limit: int = Query(10, ge=1, le=50),
):
    results = await search_raw(q, limit)
    analysis = await analyze(q, results)
    return {"query": q, "results": results, "analysis": analysis}


@app.get("/health")
async def health():
    return {"status": "ok"}
