import { search, type SearXNGResult } from "./searxng";
import { analyzeResults, deepResearch, type Analysis } from "./groq";

export interface DeepSearchEvent {
  type:
    | "status"
    | "result"
    | "analysis"
    | "subtopics"
    | "partial"
    | "complete"
    | "error";
  data: unknown;
}

interface RoundResult {
  query: string;
  results: SearXNGResult[];
  analysis: Analysis;
}

function serializeForSSE(event: DeepSearchEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
}

export async function* deepSearch(query: string, limit?: number) {
  const roundResults: RoundResult[] = [];

  yield serializeForSSE({
    type: "status",
    data: { step: "initial_search", query },
  });

  const results = await search(query, limit);

  yield serializeForSSE({
    type: "result",
    data: { query, results, round: 0 },
  });

  const analysis = await analyzeResults(query, results);
  roundResults.push({ query, results, analysis });

  yield serializeForSSE({
    type: "analysis",
    data: { query, analysis, round: 0 },
  });

  const subtopics = analysis.key_insights.slice(0, 3);

  yield serializeForSSE({
    type: "subtopics",
    data: { subtopics, round: 1 },
  });

  for (let round = 0; round < 3; round++) {
    const refinedQuery = `${query} ${subtopics[round] ?? analysis.key_insights[round % analysis.key_insights.length]}`;

    yield serializeForSSE({
      type: "status",
      data: { step: "refine_search", query: refinedQuery, round: round + 1 },
    });

    const refinedResults = await search(refinedQuery, limit);

    yield serializeForSSE({
      type: "result",
      data: { query: refinedQuery, results: refinedResults, round: round + 1 },
    });

    const refinedAnalysis = await analyzeResults(refinedQuery, refinedResults);
    roundResults.push({ query: refinedQuery, results: refinedResults, analysis: refinedAnalysis });

    yield serializeForSSE({
      type: "analysis",
      data: { query: refinedQuery, analysis: refinedAnalysis, round: round + 1 },
    });

    yield serializeForSSE({
      type: "partial",
      data: {
        round: round + 1,
        subtopic: subtopics[round] ?? `Follow-up ${round + 1}`,
        findings: refinedAnalysis.summary,
      },
    });
  }

  yield serializeForSSE({
    type: "status",
    data: { step: "synthesizing" },
  });

  const allQueries = roundResults.map((r) => [r.query]);
  const allResultSets = roundResults.map((r) => r.results);

  const report = await deepResearch(allQueries, allResultSets);

  yield serializeForSSE({
    type: "complete",
    data: report,
  });
}
