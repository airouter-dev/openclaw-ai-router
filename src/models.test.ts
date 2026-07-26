import { describe, expect, it } from "vitest";
import {
  buildManualAiRouterModel,
  normalizeAiRouterModelId,
  projectAiRouterModels,
} from "./models.js";

describe("AI Router model projection", () => {
  it("projects only explicit metadata and de-duplicates model ids", () => {
    const models = projectAiRouterModels([
      {
        id: "vendor/text-model",
        name: "Text Model",
        context_window: 65_536,
        max_output_tokens: 8_192,
        supports_reasoning: true,
        input_modalities: ["text", "image"],
      },
      { id: "vendor/text-model", name: "Duplicate" },
      { id: "disabled", active: false },
      { id: "archived", archived: true },
      { id: "bad id" },
    ]);

    expect(models).toEqual([
      {
        id: "vendor/text-model",
        name: "Text Model",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 65_536,
        maxTokens: 8_192,
      },
    ]);
  });

  it("uses conservative local defaults without inferring capabilities", () => {
    expect(projectAiRouterModels([{ id: "vendor/unknown" }])).toEqual([
      {
        id: "vendor/unknown",
        name: "vendor/unknown",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 32_000,
        maxTokens: 4_096,
      },
    ]);
  });

  it("rejects unsafe manual ids and builds a canonical fallback", () => {
    expect(normalizeAiRouterModelId("bad\nmodel")).toBeUndefined();
    expect(
      buildManualAiRouterModel({ modelId: "vendor/manual-model" }),
    ).toMatchObject({
      id: "vendor/manual-model",
      provider: "ai-router",
      api: "openai-completions",
      baseUrl: "https://api.ai-router.dev/v1",
      reasoning: false,
      input: ["text"],
    });
  });
});
