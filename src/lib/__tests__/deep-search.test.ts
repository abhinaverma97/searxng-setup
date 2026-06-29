import { describe, it, expect, vi, beforeEach } from "vitest";
import { deepSearch } from "../deep-search";

vi.mock("../searxng", () => ({
  search: vi.fn(),
}));

vi.mock("../groq", () => ({
  analyzeResults: vi.fn(),
  deepResearch: vi.fn(),
}));

import { search } from "../searxng";
import { analyzeResults, deepResearch } from "../groq";

const mockSearch = vi.mocked(search);
const mockAnalyze = vi.mocked(analyzeResults);
const mockDeepResearch = vi.mocked(deepResearch);

beforeEach(() => {
  vi.clearAllMocks();

  mockSearch.mockResolvedValue([
    { title: "R1", url: "https://a.com", snippet: "s1", engine: "bing", score: 0.9, category: "general" },
    { title: "R2", url: "https://b.com", snippet: "s2", engine: "google", score: 0.8, category: "news" },
  ]);

  mockAnalyze.mockResolvedValue({
    summary: "Test summary",
    key_insights: ["insight 1", "insight 2", "insight 3"],
    result_relevance: [],
  });

  mockDeepResearch.mockResolvedValue({
    report: "## Final Report\n\nConclusion.",
    sources: [{ url: "https://a.com", title: "Source A", key_findings: "Data" }],
  });
});

describe("deepSearch", () => {
  it("yields initial status event", async () => {
    const gen = deepSearch("test query");
    const first = await gen.next();

    expect(first.done).toBe(false);
    expect(first.value).toContain('event: status');
    expect(first.value).toContain('"step":"initial_search"');
  });

  it("yields result event", async () => {
    const gen = deepSearch("test query");

    await gen.next();
    const second = await gen.next();

    expect(second.value).toContain('event: result');
    expect(second.value).toContain('"round":0');
  });

  it("yields analysis event", async () => {
    const gen = deepSearch("test");

    await gen.next();
    await gen.next();
    const third = await gen.next();

    expect(third.value).toContain('event: analysis');
  });

  it("yields subtopics event", async () => {
    const gen = deepSearch("test");

    await gen.next();
    await gen.next();
    await gen.next();
    const fourth = await gen.next();

    expect(fourth.value).toContain('event: subtopics');
    expect(fourth.value).toContain('"subtopics"');
  });

  it("completes with report after all rounds", async () => {
    mockSearch.mockResolvedValue([
      { title: "R1", url: "https://a.com", snippet: "s1", engine: "bing", score: 0.9, category: "general" },
    ]);

    const gen = deepSearch("test", 5);

    let last: string | undefined;
    let result = await gen.next();
    while (!result.done) {
      last = result.value;
      result = await gen.next();
    }

    expect(last).toContain('event: complete');
    expect(last).toContain("Final Report");
  });

  it("calls search multiple times for refinement rounds", async () => {
    const gen = deepSearch("test");
    let result = await gen.next();
    while (!result.done) {
      result = await gen.next();
    }

    expect(mockSearch).toHaveBeenCalledTimes(4); // 1 initial + 3 refinements
  });
});
