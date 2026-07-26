import { AI_ROUTER_BASE_URL, AI_ROUTER_PROVIDER_ID } from "./constants.js";
export function applyAiRouterConfig(config) {
    const existingProvider = config.models?.providers?.[AI_ROUTER_PROVIDER_ID];
    return {
        ...config,
        models: {
            ...config.models,
            mode: config.models?.mode ?? "merge",
            providers: {
                ...config.models?.providers,
                [AI_ROUTER_PROVIDER_ID]: {
                    ...existingProvider,
                    baseUrl: AI_ROUTER_BASE_URL,
                    api: "openai-completions",
                    models: existingProvider?.models ?? [],
                },
            },
        },
    };
}
//# sourceMappingURL=config.js.map