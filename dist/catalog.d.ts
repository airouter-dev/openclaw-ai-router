import type { ProviderCatalogContext, ProviderCatalogResult } from "openclaw/plugin-sdk/plugin-entry";
import { type LiveModelCatalogFetchGuard } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
export type AiRouterCatalogDependencies = {
    fetchGuard?: LiveModelCatalogFetchGuard;
};
export declare function buildAiRouterProvider(): ModelProviderConfig;
export declare function buildAiRouterCatalog(context: ProviderCatalogContext, dependencies?: AiRouterCatalogDependencies): Promise<ProviderCatalogResult>;
//# sourceMappingURL=catalog.d.ts.map