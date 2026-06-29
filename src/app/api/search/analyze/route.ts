import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/searxng";
import { analyzeResults } from "@/lib/groq";
import { requireApiKey } from "@/lib/with-auth";

export async function POST(req: NextRequest) {
  const auth = await requireApiKey(req);
  if (auth instanceof NextResponse) return auth;

  let body: { query?: string; limit?: number };

  try {
    const text = await req.text();
    if (text.length > 10_000) {
      return NextResponse.json({ error: "Request body too large" }, { status: 400 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { query, limit } = body;

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'query' field" },
      { status: 400 }
    );
  }

  if (query.length > 500) {
    return NextResponse.json({ error: "Query exceeds 500 character limit" }, { status: 400 });
  }

  try {
    const results = await search(query, limit);
    const analysis = await analyzeResults(query, results);
    return NextResponse.json({ query, results, analysis });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
