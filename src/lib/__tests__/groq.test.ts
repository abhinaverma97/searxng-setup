import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      constructor(_opts: { apiKey: string }) { void _opts; }
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
  };
});

function makeMockResponse(content: string) {
  return {
    choices: [{ message: { content } }],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.GROQ_API_KEY = "test-key";
});

describe("analyzeResults", () => {
  const testResults = [
    { title: "R1", url: "https://a.com", snippet: "snippet a" },
    { title: "R2", url: "https://b.com", snippet: "snippet b" },
  ];

  it("returns parsed analysis JSON", async () => {
    mockCreate.mockResolvedValue(
      makeMockResponse(
        JSON.stringify({
          summary: "A test summary",
          key_insights: ["insight 1"],
          result_relevance: [
            { url: "https://a.com", relevance: "relevant" },
            { url: "https://b.com", relevance: "somewhat" },
          ],
        })
      )
    );

    const { analyzeResults } = await import("../groq");
    const result = await analyzeResults("test query", testResults);

    expect(result.summary).toBe("A test summary");
    expect(result.key_insights).toEqual(["insight 1"]);
    expect(result.result_relevance).toHaveLength(2);
  });

  it("falls back gracefully on parse failure", async () => {
    mockCreate.mockResolvedValue(makeMockResponse("not json"));

    const { analyzeResults } = await import("../groq");
    const result = await analyzeResults("test", testResults);

    expect(result.summary).toBe("Failed to parse analysis.");
    expect(result.result_relevance).toHaveLength(2);
  });

  it("falls back on empty content", async () => {
    mockCreate.mockResolvedValue(makeMockResponse(""));

    const { analyzeResults } = await import("../groq");
    const result = await analyzeResults("test", testResults);

    expect(result.summary).toBe("Failed to parse analysis.");
  });

  it("throws if GROQ_API_KEY is missing", async () => {
    delete process.env.GROQ_API_KEY;

    const { analyzeResults } = await import("../groq");
    await expect(analyzeResults("test", testResults)).rejects.toThrow(
      "GROQ_API_KEY is not set"
    );
  });
});

describe("deepResearch", () => {
  it("returns synthesized report", async () => {
    mockCreate.mockResolvedValue(
      makeMockResponse(
        JSON.stringify({
          report: "## Research Report\n\nFindings...",
          sources: [
            {
              url: "https://a.com",
              title: "Source A",
              key_findings: "Important data",
            },
          ],
        })
      )
    );

    const { deepResearch } = await import("../groq");
    const result = await deepResearch(
      [["query1"], ["query2"]],
      [
        [{ title: "R1", url: "https://a.com", snippet: "s", engine: "bing", category: "general" }],
        [{ title: "R2", url: "https://b.com", snippet: "s", engine: "google", category: "news" }],
      ]
    );

    expect(result.report).toContain("Research Report");
    expect(result.sources).toHaveLength(1);
  });

  it("falls back on parse failure", async () => {
    mockCreate.mockResolvedValue(makeMockResponse("bad json"));

    const { deepResearch } = await import("../groq");
    const result = await deepResearch([["q"]], [[]]);

    expect(result.report).toBe("Failed to synthesize research.");
    expect(result.sources).toEqual([]);
  });
});
