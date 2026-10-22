#!/usr/bin/env node
// pnpm create thats-your-cue my-app [--template 0.0.1] [--name …] [--description …] [--url …] [--yes]
//
// Downloads the template/ folder of a thats-your-cue release into a new
// directory, then runs the template's own `scripts/make-it-yours.mjs` there. All setup lives in that
// script; this file only fetches the template. No dependencies.
import { spawn, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { Readable } from "node:stream";
import { parseArgs } from "node:util";

const REPO = "felton/thats-your-cue";
// The template's releases are tagged template-v1.2.3. The repo's other
// packages release under their own tags.
const TAG_PREFIX = "template-v";

const usage = `Usage: pnpm create thats-your-cue <directory> [options]

Options:
  --template <version>  Template release, such as 0.0.1 (default: latest)
  --name <name>         Site name (default: the directory name)
  --description <text>  One-line description
  --url <url>           Public address, including any subpath
  -y, --yes             Don't ask; use defaults for anything not given
  -h, --help            Show this help`;

const fail = (message) => {
  console.error(`create-thats-your-cue: ${message}`);
  process.exit(1);
};

let args;
try {
  args = parseArgs({
    allowPositionals: true,
    options: {
      template: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      url: { type: "string" },
      yes: { type: "boolean", short: "y", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
} catch (error) {
  fail(`${error.message}\n\n${usage}`);
}
const { values: flags, positionals } = args;
if (flags.help) {
  console.log(usage);
  process.exit(0);
}

// 1. Where to put it: an empty or new directory.
let dir = positionals[0];
if (!dir && !flags.yes && process.stdin.isTTY) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  dir = (await rl.question("Project directory (my-app): ")).trim() || "my-app";
  rl.close();
}
if (!dir) fail(`give a directory.\n\n${usage}`);
const target = path.resolve(dir);
if (existsSync(target) && readdirSync(target).length > 0) {
  fail(`${dir} isn't empty.`);
}

// 2. Which release.
const parseVersion = (tag) => tag.match(/^(?:template-)?v?(\d+\.\d+\.\d+)$/)?.[1];

// CREATE_TYC_SOURCE copies a local template directory instead of
// downloading. For tests.
const source = process.env.CREATE_TYC_SOURCE;
let tag;
if (!source) {
  let version;
  if (flags.template) {
    version = parseVersion(flags.template);
    if (!version) fail(`--template must be a release such as 0.0.1, not "${flags.template}".`);
  } else {
    // GITHUB_TOKEN, when set (as in CI), avoids the unauthenticated rate limit.
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
      headers: {
        accept: "application/vnd.github+json",
        ...(token && { authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) fail(`couldn't look up the latest release (${res.status}). Pass --template.`);
    // Newest first, so the first template release is the latest.
    const latest = (await res.json()).find(
      (release) => !release.draft && !release.prerelease && release.tag_name.startsWith(TAG_PREFIX),
    );
    if (!latest) fail("couldn't find a template release. Pass --template.");
    version = parseVersion(latest.tag_name);
  }
  tag = `${TAG_PREFIX}${version}`;
}

// 3. Fetch the template into the directory.
// verbatimSymlinks keeps .claude/skills' relative links pointing inside the copy.
const copy = (from) => cpSync(from, target, { recursive: true, verbatimSymlinks: true });
mkdirSync(target, { recursive: true });
if (source) {
  copy(source);
} else {
  console.log(`Downloading thats-your-cue ${tag}…`);
  const res = await fetch(`https://codeload.github.com/${REPO}/tar.gz/refs/tags/${tag}`);
  if (!res.ok) fail(`couldn't download ${tag} (${res.status}).`);
  // The system tar unpacks the whole repo (macOS, Linux and Windows 10+ all
  // have one), then only its template/ folder is copied over.
  const unpacked = mkdtempSync(path.join(tmpdir(), "create-thats-your-cue-"));
  const tar = spawn("tar", ["-xz", "--strip-components=1", "-C", unpacked], {
    stdio: ["pipe", "inherit", "inherit"],
  });
  Readable.fromWeb(res.body).pipe(tar.stdin);
  const code = await new Promise((resolve, reject) => {
    tar.on("error", reject);
    tar.on("close", resolve);
  });
  if (code !== 0) fail(`tar exited with ${code} while unpacking ${tag}.`);
  const template = path.join(unpacked, "template");
  if (!existsSync(template)) fail(`${tag} has no template folder.`);
  copy(template);
  rmSync(unpacked, { recursive: true, force: true });
}

// 4. Hand over to the template's own setup.
const script = path.join(target, "scripts", "make-it-yours.mjs");
if (!existsSync(script)) fail(`the template in ${dir} has no scripts/make-it-yours.mjs.`);
const passed = ["name", "description", "url"].flatMap((key) =>
  flags[key] === undefined ? [] : [`--${key}`, flags[key]],
);
if (flags.yes) passed.push("--yes");
const setup = spawnSync(process.execPath, [script, ...passed], { cwd: target, stdio: "inherit" });
if (setup.status !== 0) {
  fail(`setup didn't finish. The files are in ${dir}: fix the problem and run pnpm make-it-yours there.`);
}

console.log(`Start with: cd ${dir}`);
