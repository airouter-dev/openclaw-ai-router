import { AI_ROUTER_BASE_URL, UNKNOWN_MODEL_CONTEXT_WINDOW, UNKNOWN_MODEL_COST, UNKNOWN_MODEL_MAX_TOKENS, } from "./constants.js";
function readRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : undefined;
}
function readString(records, keys) {
    for (const record of records) {
        for (const key of keys) {
            const value = record?.[key];
            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }
        }
    }
    return undefined;
}
function readBoolean(records, keys) {
    for (const record of records) {
        for (const key of keys) {
            const value = record?.[key];
            if (typeof value === "boolean") {
                return value;
            }
        }
    }
    return undefined;
}
function readPositiveInteger(records, keys) {
    for (const record of records) {
        for (const key of keys) {
            const value = record?.[key];
            if (typeof value === "number" &&
                Number.isSafeInteger(value) &&
                value > 0) {
                return value;
            }
        }
    }
    return undefined;
}
function readStringArray(records, keys) {
    for (const record of records) {
        for (const key of keys) {
            const value = record?.[key];
            if (Array.isArray(value)) {
                const strings = value
                    .filter((entry) => typeof entry === "string")
                    .map((entry) => entry.trim().toLowerCase())
                    .filter(Boolean);
                if (strings.length > 0) {
                    return strings;
                }
            }
        }
    }
    return [];
}
export function normalizeAiRouterModelId(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const modelId = value.trim();
    if (!modelId || modelId.length > 512) {
        return undefined;
    }
    for (const character of modelId) {
        const codePoint = character.codePointAt(0) ?? 0;
        if (codePoint <= 0x20 || codePoint === 0x7f) {
            return undefined;
        }
    }
    return modelId;
}
function projectAiRouterModel(row) {
    const record = readRecord(row);
    if (!record) {
        return undefined;
    }
    const capabilities = readRecord(record.capabilities);
    const architecture = readRecord(record.architecture);
    const modelInfo = readRecord(record.model_info);
    const records = [record, capabilities, architecture, modelInfo];
    const id = normalizeAiRouterModelId(readString(records, ["id", "model", "model_name", "modelName"]));
    if (!id) {
        return undefined;
    }
    if (readBoolean(records, ["active", "enabled", "available"]) === false) {
        return undefined;
    }
    if (readBoolean(records, ["archived", "deprecated"]) === true) {
        return undefined;
    }
    const contextWindow = readPositiveInteger(records, [
        "context_window",
        "contextWindow",
        "context_length",
        "contextLength",
        "max_input_tokens",
        "maxInputTokens",
    ]) ?? UNKNOWN_MODEL_CONTEXT_WINDOW;
    const maxTokens = readPositiveInteger(records, [
        "max_completion_tokens",
        "maxCompletionTokens",
        "max_output_tokens",
        "maxOutputTokens",
        "max_tokens",
        "maxTokens",
    ]) ?? Math.min(contextWindow, UNKNOWN_MODEL_MAX_TOKENS);
    const inputModalities = readStringArray(records, [
        "input_modalities",
        "inputModalities",
        "input",
    ]);
    return {
        id,
        name: readString(records, ["display_name", "displayName", "name"]) ?? id,
        reasoning: readBoolean(records, [
            "reasoning",
            "supports_reasoning",
            "supportsReasoning",
        ]) ?? false,
        input: inputModalities.includes("image") ? ["text", "image"] : ["text"],
        cost: { ...UNKNOWN_MODEL_COST },
        contextWindow,
        maxTokens,
    };
}
export function projectAiRouterModels(rows) {
    const models = rows
        .map(projectAiRouterModel)
        .filter((model) => Boolean(model));
    const uniqueModels = new Map();
    for (const model of models) {
        if (!uniqueModels.has(model.id)) {
            uniqueModels.set(model.id, model);
        }
    }
    return [...uniqueModels.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
export function buildManualAiRouterModel(params) {
    const id = normalizeAiRouterModelId(params.modelId);
    if (!id) {
        return undefined;
    }
    const contextWindow = UNKNOWN_MODEL_CONTEXT_WINDOW;
    const maxTokens = Math.min(contextWindow, UNKNOWN_MODEL_MAX_TOKENS);
    return {
        id,
        name: id,
        api: "openai-completions",
        provider: "ai-router",
        baseUrl: AI_ROUTER_BASE_URL,
        reasoning: false,
        input: ["text"],
        cost: { ...UNKNOWN_MODEL_COST },
        contextWindow,
        maxTokens,
    };
}
//# sourceMappingURL=models.js.map