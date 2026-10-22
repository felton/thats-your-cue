# thats-your-cue (monorepo)

The repo behind **That's your cue**, a Vite starter. Users only ever get `template/`; everything else is for maintaining it.

| Folder                            | What it is                                         | Released as                      |
| --------------------------------- | -------------------------------------------------- | -------------------------------- |
| `template/`                       | The starter people copy                            | `template-vX.Y.Z` GitHub release |
| `docs/`                           | The docs site, deployed to GitHub Pages            | not released                     |
| `packages/create-thats-your-cue/` | `pnpm create thats-your-cue` CLI                   | npm, `create-thats-your-cue-v…`  |
| `packages/thats-your-cue/`        | Placeholder for shared tooling; nothing in it yet  | npm, `thats-your-cue-v…`         |

`CONTEXT.md` is the glossary for maintaining the template. Read it before renaming concepts.

## Commands

`pnpm check` at the root checks every folder: the template's and docs' `check`, and the CLI's tests. **It must pass before a task is done.** Each folder also works on its own: `cd template && pnpm check`.

There is no pnpm workspace. `template/` and `docs/` each have their own `pnpm-lock.yaml`, which derived projects need (a workspace shares one root lockfile unless `shared-workspace-lockfile: false` is set), and the packages have no dependencies. Add `pnpm-workspace.yaml` only when the packages share code.

The pnpm version is pinned once, in `packageManager` in `template/package.json`. Dependabot doesn't bump it: upgrade it there by hand, and `pnpm sync:template` copies it to `docs/`.

## Rules per folder

- **`template/`** follows its own `AGENTS.md`, which ships to every derived project. Keep monorepo details out of it. Its `.github/`, `release-please-config.json` and `.release-please-manifest.json` are for derived projects too: this repo's workflows and release config are at the root. Its scripts must work under npm, yarn and bun (no `pnpm` inside `package.json` scripts); docs and READMEs list pnpm first as recommended.
- **Skills** live in `template/.agents/skills/`, which ships to users. The root `.agents` is a symlink to `template/.agents`, and `.claude/skills` links to `.agents/skills` here and in `template/`, so every folder sees one copy. Add or update skills from `template/` (`npx skills add …` there), so `template/skills-lock.json` stays in step.
- **`docs/`** follows `docs/AGENTS.md`. It vendors template code from a `template-v…` tag with `pnpm sync:template`, never from `../template` directly.
- **`packages/create-thats-your-cue/`**: one file, `index.mjs`, with no dependencies (`node:` built-ins only).
  - Keep setup logic out of it. The CLI finds the newest `template-v…` release, downloads the repo tarball, copies its `template/` folder, and runs that release's `scripts/make-it-yours.mjs`. Changes to what setting up a project means belong in `template/scripts/make-it-yours.mjs`.
  - Flags are passed through to make-it-yours (`--name`, `--description`, `--url`, `--yes`). A new template flag needs adding to `parseArgs` and the pass-through list.
  - Tests: `node --test` runs the CLI as a child process with `CREATE_TYC_SOURCE` pointing at a fake template. CI also creates a project from the real `template/` folder on Linux and Windows.
  - CI's `create-from-release` job runs this commit's CLI against the **latest released** template, the way users get it. It fails when the CLI needs a template change that hasn't been released yet: keep the CLI compatible with the latest template release, or merge the release PR. That's a real failure, not flakiness: `npx create-thats-your-cue` fails the same way until the release.

## Commits and releases

- [Conventional Commits](https://www.conventionalcommits.org/), squash-merged. release-please (root `release-please-config.json`, manifest mode) keeps one combined release PR that bumps every folder with releasable changes. Merging it tags each one (`template-v…`, `create-thats-your-cue-v…`, `thats-your-cue-v…`) and publishes the released packages to npm with provenance (npm trusted publishing).
- Scope commits by folder when it helps: `fix(template): …`, `feat(create): …`. release-please assigns commits by the paths they touch, not the scope.
- Don't edit `CHANGELOG.md` files or `version` fields by hand.
