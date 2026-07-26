import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
import type { ProviderPlugin } from "openclaw/plugin-sdk/provider-model-shared";
import { describe, expect, it } from "vitest";
import plugin from "./index.js";

function registerProvider(): ProviderPlugin {
  let captured: ProviderPlugin | undefined;
  if (!plugin.register) {
    throw new Error("plugin does not expose a register function");
  }
  plugin.register({
    registerProvider(provider: ProviderPlugin) {
      captured = provider;
    },
  } as unknown as OpenClawPluginApi);
  if (!captured) {
    throw new Error("plugin did not register a provider");
  }
  return captured;
}

describe("AI Router plugin registration", () => {
  it("registers one canonical provider with API-key onboarding", () => {
    const provider = registerProvider();

    expect(provider.id).toBe("ai-router");
    expect(provider.envVars).toEqual(["AI_ROUTER_API_KEY"]);
    expect(provider.auth?.[0]?.id).toBe("api-key");
    expect(provider.docsPath).toBe("/providers/models#custom-providers");
  });

  it("normalizes endpoint and transport while preserving user model rows", () => {
    const provider = registerProvider();
    const normalized = provider.normalizeConfig?.({
      provider: "ai-router",
      providerConfig: {
        baseUrl: "https://untrusted.example/v1",
        api: "openai-responses",
        models: [],
      },
    });

    expect(normalized).toMatchObject({
      baseUrl: "https://api.ai-router.dev/v1",
      api: "openai-completions",
      models: [],
    });
  });
});
