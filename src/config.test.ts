import { describe, expect, it } from "vitest";
import { applyAiRouterConfig } from "./config.js";

describe("AI Router configuration", () => {
  it("adds the provider without replacing unrelated model configuration", () => {
    const result = applyAiRouterConfig({
      models: {
        providers: {
          existing: {
            baseUrl: "https://example.test/v1",
            models: [],
          },
        },
      },
    });

    expect(result.models?.mode).toBe("merge");
    expect(result.models?.providers?.existing?.baseUrl).toBe(
      "https://example.test/v1",
    );
    expect(result.models?.providers?.["ai-router"]).toEqual({
      baseUrl: "https://api.ai-router.dev/v1",
      api: "openai-completions",
      models: [],
    });
  });

  it("preserves manually configured models while restoring the canonical endpoint", () => {
    const result = applyAiRouterConfig({
      models: {
        mode: "replace",
        providers: {
          "ai-router": {
            baseUrl: "https://invalid.example/v1",
            api: "openai-responses",
            models: [
              {
                id: "vendor/manual",
                name: "Manual",
                reasoning: false,
                input: ["text"],
                cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
                contextWindow: 32_000,
                maxTokens: 4_096,
              },
            ],
          },
        },
      },
    });

    expect(result.models?.mode).toBe("replace");
    expect(result.models?.providers?.["ai-router"]?.baseUrl).toBe(
      "https://api.ai-router.dev/v1",
    );
    expect(result.models?.providers?.["ai-router"]?.models[0]?.id).toBe(
      "vendor/manual",
    );
  });
});
