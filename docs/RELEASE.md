# Release Process

1. Confirm the pinned OpenClaw development dependency is the latest tested
   stable release in the supported `2026.x` line.
2. Run all checks with a Node.js version accepted by OpenClaw:

   ```bash
   npm ci
   npm run validate
   npm audit --omit=dev
   npm pack --dry-run
   ```

3. Install the real tarball through OpenClaw's managed package path:

   ```bash
   npm pack
   openclaw plugins install npm-pack:./airouter-dev-openclaw-ai-router-<version>.tgz --force
   openclaw plugins inspect ai-router --runtime --json
   ```

4. Verify all five product destinations and test one authenticated catalog
   request plus one chat completion with a disposable credential. Do not store
   the credential or response body.
5. Confirm the package contents contain `dist/`, the manifest, license, and five
   README files, with no source maps containing secrets or local paths.
6. Update `CHANGELOG.md`, replace `Unreleased` with the release date, commit, and
   create a signed `v<version>` tag.
7. Run `clawhub package publish airouter-dev/openclaw-ai-router --dry-run`.
8. Review the dry-run artifact and ownership result, then publish the same
   commit.
9. Install using `clawhub:airouter-dev/openclaw-ai-router` and inspect the
   loaded runtime.
10. Verify the public ClawHub page renders the README, source repository, and
    intended product link before recording a registry backlink.
