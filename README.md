# AI Router Provider for OpenClaw

[Deutsch](README.de.md) | [Francais](README.fr.md) | [Portugues](README.pt.md) | [Nederlands](README.nl.md)

An independent OpenClaw provider plugin for [AI Router](https://ai-router.dev). It adds API-key onboarding, authenticated model discovery, and a manual model-ID fallback through OpenClaw's public Provider Plugin SDK.

This package is independently maintained. It is not an official OpenClaw plugin and does not imply endorsement or partnership.

## Behavior

- Registers the `ai-router` provider and `AI_ROUTER_API_KEY` credential path.
- Sends inference requests to `https://api.ai-router.dev/v1` through OpenClaw's `openai-completions` adapter.
- Requests `GET /models` with the active credential through OpenClaw's guarded live-catalog helper.
- Keeps discovery advisory: authentication, timeout, network, and parsing failures do not remove manually configured models.
- Does not infer pricing or advanced capabilities. Unknown models use text-only, non-reasoning compatibility defaults until explicit metadata or local configuration says otherwise.

## Requirements

- OpenClaw `2026.7.1-2` or newer in the `2026.x` line.
- Node.js `22.22.3+`, `24.15.0+`, or `25.9.0+` within OpenClaw's supported ranges.
- An API key from your own AI Router account.

## Install

To validate and install a packed artifact from source:

```bash
npm ci
npm run validate
npm pack
openclaw plugins install npm-pack:./airouter-dev-openclaw-ai-router-0.1.2.tgz --force
openclaw plugins inspect ai-router --runtime --json
```

Install the verified ClawHub release:

```bash
openclaw plugins install clawhub:@airouter-dev/openclaw-ai-router
```

## Configure

Use OpenClaw's provider setup flow and choose **AI Router API key**, or read the credential without echoing it or placing it in shell history:

```bash
read -rsp "AI_ROUTER_API_KEY: " AI_ROUTER_API_KEY
printf '\n'
export AI_ROUTER_API_KEY
```

OpenClaw requests the model catalog only after it resolves a credential. Select one of the returned `ai-router/<model-id>` entries.

If discovery is unavailable, add the model explicitly to your OpenClaw configuration. The limits below are local safety values, not statements about the model's actual limits:

```json5
{
  models: {
    mode: "merge",
    providers: {
      "ai-router": {
        baseUrl: "https://api.ai-router.dev/v1",
        api: "openai-completions",
        models: [
          {
            id: "provider/model-id",
            name: "provider/model-id",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 32000,
            maxTokens: 4096,
          },
        ],
      },
    },
  },
}
```

## Security

The plugin fixes the service endpoint to HTTPS, delegates catalog fetching to OpenClaw's SSRF-guarded helper, and does not add logging or telemetry. Treat API keys as secrets and prefer OpenClaw's credential store or environment injection over checked-in configuration.

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Development

```bash
npm ci
npm run validate
npm pack --dry-run
```

Tests cover manifest wiring, credential-gated discovery, authenticated headers, discovery failure fallback, conservative metadata projection, manual IDs, and endpoint normalization.

## License

MIT
