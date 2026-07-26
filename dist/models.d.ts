import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
export declare function normalizeAiRouterModelId(value: unknown): string | undefined;
export declare function projectAiRouterModels(rows: readonly unknown[]): ModelDefinitionConfig[];
export declare function buildManualAiRouterModel(params: {
    modelId: string;
}): {
    id: string;
    name: string;
    api: "openai-completions";
    provider: string;
    baseUrl: string;
    reasoning: boolean;
    input: ("text" | "image")[];
    cost: {
        input: 0;
        output: 0;
        cacheRead: 0;
        cacheWrite: 0;
    };
    contextWindow: number;
    maxTokens: number;
} | undefined;
//# sourceMappingURL=models.d.ts.map