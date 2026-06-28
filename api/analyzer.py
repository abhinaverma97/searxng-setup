import os

from groq import AsyncGroq

MODEL = "llama-3.3-70b-versatile"


def _get_client() -> AsyncGroq:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY environment variable is not set")
    return AsyncGroq(api_key=api_key)

ANALYSIS_PROMPT = """You are a search result analyst. Given search results for the query "{query}", provide:

1. A concise summary of the search results (2-3 sentences)
2. Key insights across the results (bullet points)
3. For each result, a brief relevance explanation

Results:
{results}

Respond in JSON format with keys: summary, key_insights (list), results (list of {{url, title, relevance}}).
"""


async def analyze(query: str, results: list[dict]) -> dict:
    results_text = "\n\n".join(
        f"Title: {r.get('title', '')}\nURL: {r.get('url', '')}\nContent: {r.get('content', '')[:500]}"
        for r in results
    )

    # Escape curly braces to prevent KeyError from str.format()
    query_escaped = query.replace("{", "{{").replace("}", "}}")
    results_escaped = results_text.replace("{", "{{").replace("}", "}}")
    prompt = ANALYSIS_PROMPT.format(query=query_escaped, results=results_escaped)

    client = _get_client()
    completion = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=2048,
    )

    import json

    content = completion.choices[0].message.content
    if content is None:
        return {
            "summary": "No analysis returned from the model.",
            "key_insights": [],
            "results": [],
        }

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "summary": "Failed to parse analysis response.",
            "key_insights": [],
            "results": [],
            "_raw": content,
        }
