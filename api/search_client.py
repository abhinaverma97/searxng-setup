import os

import httpx

SEARXNG_URL = os.environ.get("SEARXNG_URL", "http://searxng-core:8888")


async def search(query: str, limit: int = 10) -> list[dict]:
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.post(
            f"{SEARXNG_URL}/search",
            data={"q": query, "format": "json"},
        )
        r.raise_for_status()
        data = r.json()
        results = data.get("results", [])
        for res in results:
            res.pop("parsed_url", None)
        return results[:limit]
