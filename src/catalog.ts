import type {
  ProviderCatalogContext,
  ProviderCatalogResult,
} from "openclaw/plugin-sdk/plugin-entry";
import {
  getCachedLiveProviderModelRows,
  type LiveModelCatalogFetchGuard,
} from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import { createHash } from "node:crypto";
import { AI_ROUTER_BASE_URL, AI_ROUTER_PROVIDER_ID } from "./constants.js";
import { projectAiRouterModels } from "./models.js";

export type AiRouterCatalogDependencies = {
  fetchGuard?: LiveModelCatalogFetchGuard;
};

export function buildAiRouterProvider(): ModelProviderConfig {
  return {
    baseUrl: AI_ROUTER_BASE_URL,
    api: "openai-completions",
    models: [],
  };
}

export async function buildAiRouterCatalog(
  context: ProviderCatalogContext,
  dependencies: AiRouterCatalogDependencies = {},
): Promise<ProviderCatalogResult> {
  const auth = context.resolveProviderApiKey(AI_ROUTER_PROVIDER_ID);
  if (!auth.apiKey) {
    return null;
  }

  const provider = {
    ...buildAiRouterProvider(),
    apiKey: auth.apiKey,
  };
  const discoveryApiKey = auth.discoveryApiKey ?? auth.apiKey;
  const credentialFingerprint = createHash("sha256")
    .update(discoveryApiKey)
    .digest("hex");

  try {
    const rows = await getCachedLiveProviderModelRows({
      providerId: AI_ROUTER_PROVIDER_ID,
      endpoint: `${AI_ROUTER_BASE_URL}/models`,
      apiKey: auth.apiKey,
      discoveryApiKey,
      timeoutMs: 5_000,
      ttlMs: 60_000,
      auditContext: `${AI_ROUTER_PROVIDER_ID}-model-discovery`,
      cacheKeyParts: [
        AI_ROUTER_PROVIDER_ID,
        "model-rows",
        `${AI_ROUTER_BASE_URL}/models`,
        credentialFingerprint,
      ],
      shouldCacheRows: (candidateRows) =>
        projectAiRouterModels(candidateRows).length > 0,
      ...(dependencies.fetchGuard
        ? { fetchGuard: dependencies.fetchGuard }
        : {}),
    });
    const models = projectAiRouterModels(rows);
    return {
      provider: {
        ...provider,
        models,
      },
    };
  } catch {
    // Discovery is advisory. OpenClaw can still use manually configured model ids.
  }

  return {
    provider,
  };
}
