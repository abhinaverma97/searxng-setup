import { describe, it, expect } from "vitest";
import { generateApiKey } from "../api-key";

describe("generateApiKey", () => {
  it("returns a string starting with sx_", () => {
    const key = generateApiKey();
    expect(key).toMatch(/^sx_/);
  });

  it("returns a 67-character string (3 prefix + 64 hex chars)", () => {
    const key = generateApiKey();
    expect(key.length).toBe(67);
  });

  it("generates unique keys on each call", () => {
    const key1 = generateApiKey();
    const key2 = generateApiKey();
    expect(key1).not.toBe(key2);
  });
});
