// Runs the CLI as a child process. CREATE_TYC_SOURCE points it at a small fake
// template, so nothing is downloaded.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const cli = path.join(import.meta.dirname, "index.mjs");
const tmp = () => mkdtempSync(path.join(tmpdir(), "create-tyc-"));

// A template whose make-it-yours records the arguments it was given.
function fakeTemplate({ withScript = true } = {}) {
  const dir = tmp();
  writeFileSync(path.join(dir, "package.json"), "{}\n");
  if (withScript) {
    mkdirSync(path.join(dir, "scripts"));
    writeFileSync(
      path.join(dir, "scripts", "make-it-yours.mjs"),
      'import { writeFileSync } from "node:fs";\nwriteFileSync("args.json", JSON.stringify(process.argv.slice(2)));\n',
    );
  }
  return dir;
}

const run = (args, env = {}) =>
  spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CREATE_TYC_SOURCE: "", ...env },
  });

test("copies the template and passes flags to make-it-yours", () => {
  const target = path.join(tmp(), "bakery");
  const result = run(["--name", "Bakery Co", "--url", "https://example.com", "--yes", target], {
    CREATE_TYC_SOURCE: fakeTemplate(),
  });
  assert.equal(result.status, 0, result.stderr);
  const args = JSON.parse(readFileSync(path.join(target, "args.json"), "utf8"));
  assert.deepEqual(args, ["--name", "Bakery Co", "--url", "https://example.com", "--yes"]);
});

test("refuses a directory that isn't empty", () => {
  const target = tmp();
  writeFileSync(path.join(target, "keep.txt"), "");
  const result = run([target], { CREATE_TYC_SOURCE: fakeTemplate() });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /isn't empty/);
});

test("refuses a template that isn't a release tag", () => {
  const result = run(["--template", "main", path.join(tmp(), "app")]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /release such as/);
});

test("fails when the template has no make-it-yours", () => {
  const result = run([path.join(tmp(), "app")], {
    CREATE_TYC_SOURCE: fakeTemplate({ withScript: false }),
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no scripts\/make-it-yours\.mjs/);
});

test("needs a directory when it can't ask", () => {
  const result = run(["--yes"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /give a directory/);
});
