# Contributing

Contributions that improve compatibility, security, tests, or documentation are
welcome. Open an issue before a change that alters provider behavior, the fixed
endpoint, authentication, catalog projection, or package ownership.

## Development

Use a Node.js version supported by `package.json`, then run:

```bash
npm ci
npm run validate
npm pack --dry-run
```

Pull requests should explain the user problem, include focused tests, avoid
unrelated refactors, and disclose material AI assistance. Never put real API
keys or provider response bodies containing account data in commits or CI.

Documentation changes must keep each localized README linked to the matching
language destination. `npm run validate:manifest` enforces this invariant.
