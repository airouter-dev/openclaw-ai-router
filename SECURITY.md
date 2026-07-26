# Security Policy

## Supported Versions

Only the latest released version receives security fixes.

## Reporting A Vulnerability

Do not open a public issue for a suspected vulnerability or include API keys,
authorization headers, account identifiers, or full provider responses in a
report.

Use GitHub private vulnerability reporting:

`https://github.com/airouter-dev/openclaw-ai-router/security/advisories/new`

Include the affected version, a minimal reproduction without credentials, the
expected impact, and any suggested mitigation. Receipt will be acknowledged as
soon as practical. A fix and disclosure timeline will be coordinated through
the private advisory.

## Credential Handling

The plugin delegates credential storage to OpenClaw. It must never log, render,
commit, or include an API key in fixtures, screenshots, traces, issue text, or
test output.
