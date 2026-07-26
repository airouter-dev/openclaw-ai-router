import type { ProviderCatalogContext } from "openclaw/plugin-sdk/plugin-entry";
import {
  clearLiveCatalogCacheForTests,
  type LiveModelCatalogFetchGuard,
} from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildAiRouterCatalog } from "./catalog.js";

function catalogContext(apiKey?: string): ProviderCatalogContext {
  return {
    resolveProviderApiKey: () => ({ apiKey, discoveryApiKey: apiKey }),
  } as unknown as ProviderCatalogContext;
}

function singleProvider(
  result: Awaited<ReturnType<typeof buildAiRouterCatalog>>,
) {
  if (!result || !("provider" in result)) {
    throw new Error("expected a single provider catalog result");
  }
  return result.provider;
}

describe("AI Router catalog", () => {
  beforeEach(() => clearLiveCatalogCacheForTests());

  it("does not call discovery without a credential", async () => {
    const fetchGuard = vi.fn() as unknown as LiveModelCatalogFetchGuard;
    await expect(
      buildAiRouterCatalog(catalogContext(), { fetchGuard }),
    ).resolves.toBeNull();
    expect(fetchGuard).not.toHaveBeenCalled();
  });

  it("discovers models with an authenticated guarded request", async () => {
    let authorization: string | null = null;
    const release = vi.fn(async () => undefined);
    const fetchGuard: LiveModelCatalogFetchGuard = async ({ url, init }) => {
      authorization = new Headers(init?.headers).get("authorization");
      return {
        response: new Response(
          JSON.stringify({
            data: [
              { id: "vendor/model-b", object: "model" },
              { id: "vendor/model-a", object: "model", context_window: 64_000 },
            ],
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
        finalUrl: url,
        release,
      };
    };

    const result = await buildAiRouterCatalog(catalogContext("test-secret"), {
      fetchGuard,
    });
    const provider = singleProvider(result);

    expect(authorization).toBe("Bearer test-secret");
    expect(provider.baseUrl).toBe("https://api.ai-router.dev/v1");
    expect(provider.models.map((model) => model.id)).toEqual([
      "vendor/model-a",
      "vendor/model-b",
    ]);
    expect(release).toHaveBeenCalledOnce();
  });

  it("keeps the static fallback when discovery fails without exposing the key", async () => {
    const fetchGuard: LiveModelCatalogFetchGuard = async ({ url }) => ({
      response: new Response("not authorized", { status: 401 }),
      finalUrl: url,
      release: async () => undefined,
    });

    const result = await buildAiRouterCatalog(catalogContext("do-not-leak"), {
      fetchGuard,
    });

    expect(singleProvider(result).models).toEqual([]);
  });
});
