// Bring the docs site up to the template release in TEMPLATE_VERSION:
//   1. record which components that release ships (app/content/shipped-components.txt)
//   2. re-copy the template's UI components, theme and Node version from the tag
//   3. merge the template's changes into files this site has customized
//   4. match the version range of every dependency both projects use, and let
//      pnpm update the lockfile rather than merging main's
// Run on a clean tree after bumping TEMPLATE_VERSION, review the diff, then commit.
// It reads the template from its release tag (template-vX.Y.Z), not from
// ../template, so the docs only ever show what a release shipped.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const tagFor = (version) => `template-v${version.trim()}`;
const tag = tagFor(readFileSync("TEMPLATE_VERSION", "utf8"));
const ui = "app/components/ui";

// Files this site has changed from the template. Instead of being re-copied,
// they get the template's diff between the last synced release and this one,
// applied as a three-way merge: conflicts show up as markers to resolve.
const merged = ["app/root.tsx", "react-router.config.ts", "vite.config.ts"];

// Components the docs site adds on top of the template. Sync leaves them alone.
const docsOnly = new Set([
  "accordion",
  "alert",
  "badge",
  "breadcrumb",
  "card",
  "input",
  "sheet",
  "sidebar",
  "skeleton",
  "switch",
  "table",
  "tabs",
  "tooltip",
]);

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
// The template's copy of a file at a tag. Paths are relative to template/.
const fromTemplate = (ref, file) => git("show", `${ref}:template/${file}`);

git("fetch", "--tags", "--quiet");

// 1. The components the tag ships. The Props page shows exactly these.
// --full-tree: from docs/, ls-tree would otherwise list only a docs/ subfolder.
const shipped = git("ls-tree", "--full-tree", "--name-only", `${tag}:template/${ui}`)
  .split("\n")
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.slice(0, -".tsx".length));
writeFileSync("app/content/shipped-components.txt", shipped.join("\n") + "\n");

// 2. Copy the tag's files over ours. Docs-only components are left in place.
for (const file of [
  ...shipped.map((name) => `${ui}/${name}.tsx`),
  "app/app.css",
  "app/lib/theme.ts",
  "app/components/theme-toggle.tsx",
  ".nvmrc",
]) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, fromTemplate(tag, file));
}

// 3. The last synced release is the committed TEMPLATE_VERSION. The template's
// diff between the two tags is applied to our copies from the repo root.
const fromTag = tagFor(git("show", "HEAD:./TEMPLATE_VERSION"));
let conflicts = false;
if (fromTag !== tag) {
  const patch = git(
    "diff",
    "--relative=template",
    fromTag,
    tag,
    "--",
    ...merged.map((f) => `../template/${f}`),
  );
  if (patch) {
    try {
      execFileSync("git", ["apply", "--3way", "--directory=docs"], {
        cwd: "..",
        input: patch,
        stdio: ["pipe", "inherit", "inherit"],
      });
      console.log(`Merged ${fromTag}..${tag} into ${merged.join(", ")}.`);
    } catch {
      conflicts = true;
    }
  }
}

// 4. Dependencies. Copy the template's version range for every package both
// projects use, then let `pnpm install` update the lockfile (no lockfile merging).
// Docs-only packages (MDX, Shiki, rehype…) aren't in the template, so they're
// never touched, and each package stays in its section here.
const template = JSON.parse(fromTemplate(tag, "package.json"));
const ours = JSON.parse(readFileSync("package.json", "utf8"));
const wanted = { ...template.dependencies, ...template.devDependencies };
let changed = false;

for (const section of ["dependencies", "devDependencies"]) {
  for (const [name, current] of Object.entries(ours[section] ?? {})) {
    if (name in wanted && wanted[name] !== current) {
      console.log(`${name} ${current} -> ${wanted[name]}`);
      ours[section][name] = wanted[name];
      changed = true;
    }
  }
}
if (template.packageManager && template.packageManager !== ours.packageManager) {
  console.log(`packageManager ${ours.packageManager} -> ${template.packageManager}`);
  ours.packageManager = template.packageManager;
  changed = true;
}
if (changed) {
  writeFileSync("package.json", JSON.stringify(ours, null, 2) + "\n");
  execFileSync("pnpm", ["install"], { stdio: "inherit" });
}

// Flag files the tag doesn't have and that aren't docs-only: most likely a
// component the template removed.
const stale = readdirSync(ui)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.slice(0, -".tsx".length))
  .filter((name) => !shipped.includes(name) && !docsOnly.has(name));

console.log(`Synced ${ui}, theme and dependencies from ${tag}.`);
if (conflicts) {
  console.error(
    `Merging ${fromTag}..${tag} left conflicts: resolve the markers (git diff --name-only --diff-filter=U), then git add.`,
  );
  process.exitCode = 1;
}
if (stale.length) {
  console.error(
    `Not in ${tag} and not docs-only (delete, or add to docsOnly):\n  ${stale.map((n) => `${ui}/${n}.tsx`).join("\n  ")}`,
  );
  process.exit(1);
}
