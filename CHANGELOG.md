# Changelog

All notable changes will be documented in this file.

## 0.1.2 - 2026-07-26

- Replace literal API-key placeholders with interactive, no-echo shell input.
- Keep credentials out of shell history and avoid false-positive secret scans.

## 0.1.1 - 2026-07-26

- Include the compiled `dist/` entrypoint in source-backed ClawHub artifacts.
- Correct the scoped ClawHub install spec in all setup guides.
- Verify in CI that committed build output matches the TypeScript source.

## 0.1.0 - 2026-07-26

- Register the independent `ai-router` provider for OpenClaw.
- Add API-key onboarding through `AI_ROUTER_API_KEY`.
- Add authenticated, SSRF-guarded live model discovery.
- Add conservative metadata projection and manual model-ID fallback.
- Add English, German, French, Portuguese, and Dutch setup documentation.
