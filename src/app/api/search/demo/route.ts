import { search } from "@/lib/searxng";
import { analyzeResults } from "@/lib/groq";
import { deepSearch } from "@/lib/deep-search";

const rateLimit = new Map<string, number[]>();
const RATE_LIMIT = 15;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  rateLimit.set(ip, recent);
  return true;
}

function parseDeepSSE(sseString: string): string | null {
  // sseString format: "event: type\ndata: {...}\n\n"
  const eventMatch = sseString.match(/^event: (\w+)\s*\n/);
  const dataMatch = sseString.match(/\ndata: (.+)\s*\n\s*\n$/);
  if (eventMatch && dataMatch) {
    const type = eventMatch[1];
    try {
      const data = JSON.parse(dataMatch[1]);
      return JSON.stringify({ type, ...data });
    } catch {
      return null;
    }
  }
  return null;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return Response.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  let body: { query?: string; mode?: string; limit?: number };
  try {
    const text = await req.text();
    if (text.length > 10_000) {
      return Response.json({ error: "Request body too large" }, { status: 400 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { query, mode, limit } = body;
  if (!query || typeof query !== "string") {
    return Response.json({ error: "Missing or invalid 'query' field" }, { status: 400 });
  }

  const queryStr = query.trim();
  if (!queryStr) {
    return Response.json({ error: "Query cannot be empty" }, { status: 400 });
  }

  if (queryStr.length > 500) {
    return Response.json({ error: "Query exceeds 500 character limit" }, { status: 400 });
  }

  if (mode === "deep") {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const gen = deepSearch(queryStr, limit);
          let done = false;
          while (!done) {
            const result = await gen.next();
            done = result.done ?? false;
            if (done || !result.value) break;
            const parsed = parseDeepSSE(result.value);
            if (parsed) {
              controller.enqueue(`data: ${parsed}\n\n`);
            }
          }
          controller.enqueue("data: [DONE]\n\n");
        } catch {
          controller.enqueue(`data: ${JSON.stringify({ type: "error", error: "Search failed" })}\n\n`);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const startTime = Date.now();

  try {
    const results = await search(queryStr, limit);

    if (mode === "analyze") {
      let summary = "AI summary unavailable. Please check your GROQ_API_KEY.";
      let keyInsights: string[] = [];
      try {
        const analysis = await analyzeResults(queryStr, results);
        summary = analysis.summary;
        keyInsights = analysis.key_insights;
      } catch {
        // fallback message already set
      }

      return Response.json({
        type: "analyze",
        summary,
        keyInsights,
        results: results.map((r) => ({
          title: r.title,
          url: r.url,
          snippet: r.snippet,
          engine: r.engine,
          score: r.score,
        })),
        timing: ((Date.now() - startTime) / 1000).toFixed(1),
      });
    }

    return Response.json({
      type: "search",
      results: results.map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.snippet,
        engine: r.engine,
        score: r.score,
      })),
      timing: ((Date.now() - startTime) / 1000).toFixed(1),
    });
  } catch {
    return Response.json(
      { error: "Search backend unavailable. Is SearXNG running?" },
      { status: 503 }
    );
  }
}
