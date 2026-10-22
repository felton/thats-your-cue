#!/usr/bin/env node
// Turns a fresh copy of the thats-your-cue template into your own project, then
// deletes itself. No dependencies, so it runs before `pnpm install`.
// Usage: pnpm make-it-yours [--name "Bakery Co"] [--description "…"] [--url https://…] [--yes]
//
// Missing values are asked for in a terminal. With --yes, or without a terminal
// (agents, CI), the name defaults to the directory name and the rest to empty.
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";

const { values: flags } = parseArgs({
  options: {
    name: { type: "string" },
    description: { type: "string" },
    url: { type: "string" },
    yes: { type: "boolean", short: "y", default: false },
  },
});

const fail = (message) => {
  console.error(`make-it-yours: ${message}`);
  process.exit(1);
};

if (existsSync("TEMPLATE_VERSION")) {
  fail("TEMPLATE_VERSION exists, so this project has already been made yours.");
}
if (!existsSync("app/lib/site.ts")) {
  fail("run this from the project root.");
}

// 1. Ask for whatever the flags didn't give.
const defaults = { name: path.basename(process.cwd()), description: "", url: "" };
const answers = { ...flags };
if (!flags.yes && process.stdin.isTTY) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (key, question) => {
    if (answers[key] !== undefined) return;
    const hint = defaults[key] ? ` (${defaults[key]})` : "";
    answers[key] = (await rl.question(`${question}${hint}: `)).trim() || defaults[key];
  };
  await ask("name", "Site name");
  await ask("description", "One-line description");
  await ask("url", "Public URL, if you know it (leave empty for now)");
  rl.close();
}
const name = (answers.name ?? defaults.name).trim();
const description = (answers.description ?? defaults.description).trim();
const url = (answers.url ?? defaults.url).trim().replace(/\/$/, "");

if (!name) fail("the name can't be empty.");
if (url && !/^https?:\/\/[^/\s]+/.test(url)) {
  fail(`the URL must be a full address like https://example.com, not "${url}".`);
}

// The package manager that ran this (or `create`), for the commands printed
// below. They all set npm_config_user_agent; plain `node` doesn't, so pnpm.
const pm = process.env.npm_config_user_agent?.match(/^(npm|pnpm|yarn|bun)\//)?.[1] ?? "pnpm";
const run = pm === "npm" ? "npm run" : pm;

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const writeJson = (file, data) => writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
const slug =
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "my-app";

// 2. Record the template release this project starts from.
const pkg = readJson("package.json");
const templateVersion = pkg.version;
writeFileSync("TEMPLATE_VERSION", `${templateVersion}\n`);

// 3. package.json: your name, your versioning, no template-only fields.
pkg.name = slug;
pkg.version = "0.1.0";
delete pkg.homepage;
delete pkg.scripts["make-it-yours"];
writeJson("package.json", pkg);

// 4. release-please starts from 0.1.0.
writeJson(".release-please-manifest.json", { ".": "0.1.0" });

// 5. Site facts. Each value is one line in site.ts; fail rather than guess.
let site = readFileSync("app/lib/site.ts", "utf8");
for (const [key, value] of Object.entries({ name, description, url })) {
  const line = new RegExp(`^(  ${key}: )".*",$`, "m");
  if (!line.test(site)) fail(`couldn't find the ${key} line in app/lib/site.ts.`);
  site = site.replace(line, `$1${JSON.stringify(value)},`);
}
writeFileSync("app/lib/site.ts", site);

// 6. A README about this project, keeping the template's scripts table.
const templateReadme = readFileSync("README.md", "utf8");
const scripts = templateReadme.match(/## Scripts\n[\s\S]*?(?=\n## )/)?.[0].trim() ?? "";
writeFileSync(
  "README.md",
  [
    `# ${name}`,
    description,
    `## Getting started\n\n\`\`\`bash\n${pm} install\n${run} dev\n\`\`\``,
    scripts,
    `Built from [That's your cue](https://felton.github.io/thats-your-cue/) v${templateVersion}.`,
  ]
    .filter(Boolean)
    .join("\n\n") + "\n",
);

// 7. AGENTS.md: setup is done, so drop the instructions for doing it.
let agents = readFileSync("AGENTS.md", "utf8");
agents = agents
  .replace(/ The one exception is setting up a new project[^\n]*/, "")
  .replace(/^- If `scripts\/make-it-yours\.mjs` exists[^\n]*\n/m, "");
writeFileSync("AGENTS.md", agents);

// 8. Template-only files, this script included.
rmSync("CHANGELOG.md", { force: true });
rmSync(new URL(import.meta.url), { force: true });

console.log(`
${name} is yours (from thats-your-cue v${templateVersion}).

Next:
  ${pm} install && ${run} dev
  - Swap the hero image and its credit in app/welcome/welcome.tsx
  - Replace the favicon: edit assets/favicon-tile.svg, then ${run} favicon
  - For automated releases, allow GitHub Actions to create pull requests
    (Settings → Actions → General)${url ? "" : "\n  - Set url in app/lib/site.ts once you know where it'll be public"}
`);
