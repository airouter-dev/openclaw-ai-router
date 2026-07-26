import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const manifest = JSON.parse(
  await readFile(new URL("../openclaw.plugin.json", import.meta.url), "utf8"),
);

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

expect(
  packageJson.name === "@airouter-dev/openclaw-ai-router",
  "unexpected package name",
);
expect(
  packageJson.openclaw?.extensions?.[0] === "./dist/index.js",
  "runtime entry must use built JavaScript",
);
expect(
  packageJson.openclaw?.install?.clawhubSpec ===
    "@airouter-dev/openclaw-ai-router",
  "ClawHub install spec must use the scoped package name",
);
expect(manifest.id === "ai-router", "manifest provider id must be ai-router");
expect(
  manifest.providers?.includes("ai-router"),
  "manifest must declare the ai-router provider",
);
expect(
  manifest.setup?.providers?.[0]?.envVars?.includes("AI_ROUTER_API_KEY"),
  "manifest must advertise AI_ROUTER_API_KEY",
);
expect(
  manifest.modelCatalog?.discovery?.["ai-router"] === "runtime",
  "manifest must declare runtime model discovery",
);
expect(
  manifest.configSchema?.additionalProperties === false,
  "manifest config must fail closed",
);

const localeLinks = new Map([
  ["README.md", "https://ai-router.dev"],
  ["README.de.md", "https://ai-router.dev/de"],
  ["README.fr.md", "https://ai-router.dev/fr"],
  ["README.pt.md", "https://ai-router.dev/pt"],
  ["README.nl.md", "https://ai-router.dev/nl"],
]);

for (const [file, expectedLink] of localeLinks) {
  const contents = await readFile(
    new URL(`../${file}`, import.meta.url),
    "utf8",
  );
  const matches =
    contents.match(/https:\/\/ai-router\.dev(?:\/[a-z-]+)?/g) ?? [];
  expect(
    matches.length === 1,
    `${file} must contain exactly one AI Router destination`,
  );
  expect(matches[0] === expectedLink, `${file} must link to ${expectedLink}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Manifest and locale-link validation passed.");
}
