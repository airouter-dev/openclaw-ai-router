import { getCachedLiveProviderModelRows, } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { createHash } from "node:crypto";
import { AI_ROUTER_BASE_URL, AI_ROUTER_PROVIDER_ID } from "./constants.js";
import { projectAiRouterModels } from "./models.js";
export function buildAiRouterProvider() {
    return {
        baseUrl: AI_ROUTER_BASE_URL,
        api: "openai-completions",
        models: [],
    };
}
export async function buildAiRouterCatalog(context, dependencies = {}) {
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
            shouldCacheRows: (candidateRows) => projectAiRouterModels(candidateRows).length > 0,
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
    }
    catch {
        // Discovery is advisory. OpenClaw can still use manually configured model ids.
    }
    return {
        provider,
    };
}
//# sourceMappingURL=catalog.js.map