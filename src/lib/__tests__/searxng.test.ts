import { describe, it, expect, vi, beforeEach } from "vitest";
import { search } from "../searxng";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("fetch", mockFetch);
});

const mockSearXNGResponse = {
  query: "test query",
  results: [
    {
      title: "Result 1",
      url: "https://example.com/1",
      snippet: "Snippet 1",
      engine: "bing",
      score: 0.95,
      category: "general",
    },
    {
      title: "Result 2",
      url: "https://example.com/2",
      snippet: "Snippet 2",
      engine: "google",
      score: 0.85,
      category: "general",
    },
    {
      title: "Result 3",
      url: "https://example.com/3",
      snippet: "Snippet 3",
      engine: "bing",
      score: 0.75,
      category: "news",
    },
  ],
  number_of_results: 3,
};

describe("search", () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSearXNGResponse),
    });
  });

  it("returns results from SearXNG", async () => {
    const results = await search("test query");

    expect(results).toHaveLength(3);
    expect(results[0].title).toBe("Result 1");
    expect(results[0].url).toBe("https://example.com/1");
    expect(results[0].engine).toBe("bing");
  });

  it("returns all results (no limit)", async () => {
    const results = await search("test query");
    expect(results).toHaveLength(3);
  });

  it("sends POST request to SearXNG", async () => {
    await search("hello");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("/search?format=json");
    expect(options.method).toBe("POST");
  });

  it("strips parsed_url from results", async () => {
    const results = await search("test query");
    expect(Object.keys(results[0])).not.toContain("parsed_url");
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(search("fail")).rejects.toThrow("SearXNG returned 500");
  });
});
