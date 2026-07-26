export const AI_ROUTER_PROVIDER_ID = "ai-router";
export const AI_ROUTER_PROVIDER_LABEL = "AI Router";
export const AI_ROUTER_API_KEY_ENV_VAR = "AI_ROUTER_API_KEY";
export const AI_ROUTER_BASE_URL = "https://api.ai-router.dev/v1";

// These are local safety fallbacks, not claims about upstream model limits.
export const UNKNOWN_MODEL_CONTEXT_WINDOW = 32_000;
export const UNKNOWN_MODEL_MAX_TOKENS = 4_096;

export const UNKNOWN_MODEL_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
} as const;
