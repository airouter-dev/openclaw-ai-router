import {
  definePluginEntry,
  type OpenClawPluginApi,
  type OpenClawPluginDefinition,
} from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { buildAiRouterCatalog, buildAiRouterProvider } from "./catalog.js";
import { applyAiRouterConfig } from "./config.js";
import {
  AI_ROUTER_API_KEY_ENV_VAR,
  AI_ROUTER_BASE_URL,
  AI_ROUTER_PROVIDER_ID,
  AI_ROUTER_PROVIDER_LABEL,
} from "./constants.js";
import { buildManualAiRouterModel } from "./models.js";

const replayHooks = buildProviderReplayFamilyHooks({
  family: "openai-compatible",
  dropReasoningFromHistory: false,
});

const plugin: OpenClawPluginDefinition = definePluginEntry({
  id: AI_ROUTER_PROVIDER_ID,
  name: `${AI_ROUTER_PROVIDER_LABEL} Provider`,
  description: "Independent AI Router provider plugin",
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: AI_ROUTER_PROVIDER_ID,
      label: AI_ROUTER_PROVIDER_LABEL,
      docsPath: "/providers/models#custom-providers",
      envVars: [AI_ROUTER_API_KEY_ENV_VAR],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: AI_ROUTER_PROVIDER_ID,
          methodId: "api-key",
          label: "AI Router API key",
          hint: "OpenAI-compatible routing with live model discovery",
          optionKey: "aiRouterApiKey",
          flagName: "--ai-router-api-key",
          envVar: AI_ROUTER_API_KEY_ENV_VAR,
          promptMessage: "Enter AI Router API key",
          expectedProviders: [AI_ROUTER_PROVIDER_ID],
          applyConfig: applyAiRouterConfig,
          noteTitle: AI_ROUTER_PROVIDER_LABEL,
          noteMessage: [
            "Use an API key from your own AI Router account.",
            "The plugin requests the model list available to that key.",
          ].join("\n"),
          wizard: {
            choiceId: "ai-router-api-key",
            choiceLabel: "AI Router API key",
            choiceHint: "Discover models available to your account",
            groupId: AI_ROUTER_PROVIDER_ID,
            groupLabel: AI_ROUTER_PROVIDER_LABEL,
            groupHint: "OpenAI-compatible model routing",
          },
        }),
      ],
      catalog: {
        order: "simple",
        run: buildAiRouterCatalog,
      },
      staticCatalog: {
        order: "simple",
        run: async () => ({ provider: buildAiRouterProvider() }),
      },
      resolveDynamicModel: (context) =>
        buildManualAiRouterModel({ modelId: context.modelId }),
      normalizeConfig: ({ providerConfig }) =>
        providerConfig.baseUrl !== AI_ROUTER_BASE_URL ||
        providerConfig.api !== "openai-completions"
          ? {
              ...providerConfig,
              baseUrl: AI_ROUTER_BASE_URL,
              api: "openai-completions",
            }
          : undefined,
      isModernModelRef: () => true,
      ...replayHooks,
    });
  },
});

export default plugin;
