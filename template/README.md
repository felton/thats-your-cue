# that's your cue

A ready-to-shoot Vite starter: React Router, shadcn/ui, Tailwind. Places, everyone.

**Docs and live demo: [felton.github.io/thats-your-cue](https://felton.github.io/thats-your-cue/)**. The docs site is itself built with this template.

The setup work is already done (routing, styling, components, formatting, CI), so you or a coding agent can start building the actual site straight away.

## What's on set

- **React Router v8** in framework mode: server rendering, SPA or pre-rendered builds, typed routes
- **Tailwind CSS v4** and **shadcn/ui** on the [Base UI](https://base-ui.com) variant
- **TypeScript**, **oxfmt**, **oxlint**, **Vitest** and **Testing Library**
- **Dark mode** with a Light / Dark / System menu, no provider needed
- **Social cards and canonical links** from one `app/lib/site.ts`, which also sets the subpath
- **`UnsplashPicture`**, a responsive `<picture>` with art-directed crops per breakpoint
- **GitHub Actions** for CI, release-please and grouped Dependabot updates
- **`AGENTS.md`** plus the official React Router and shadcn/ui agent skills

**Good for** marketing sites, docs, dashboards and small apps. **Not for** projects that need Next.js or Astro, or the Radix flavor of shadcn/ui.

## Quick start

```bash
pnpm create thats-your-cue my-app
cd my-app
pnpm install
pnpm dev
```

pnpm is recommended, and it's what CI, the Dockerfile and the lockfile use. npm, yarn and bun work too: `npm create thats-your-cue@latest my-app`, `yarn create thats-your-cue my-app` or `bun create thats-your-cue my-app`, then `install` and `run dev` with the same tool. Other package managers ignore `pnpm-lock.yaml`, so their first install resolves fresh versions.

`create` downloads the latest release and runs `make-it-yours` in it. That asks for the site's name, description and public URL (or takes `--name`, `--description`, `--url` and `--yes`) and sets the copy up as your project. [create-thats-your-cue](https://github.com/felton/thats-your-cue/tree/main/packages/create-thats-your-cue) lists every option. To pin a release, add `--template <version>` (any version from the [Releases](https://github.com/felton/thats-your-cue/releases) page, tagged `template-v…`).

**With a coding agent:** give it a brief and the command, with the values filled in: `pnpm create thats-your-cue my-app --name "…" --description "…" --yes`. `AGENTS.md`, which `CLAUDE.md` imports, tells it the commands, layout and conventions, and to run `make-it-yours` if it finds a fresh copy.

## Scripts

| Command            | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `pnpm dev`         | Dev server at `http://localhost:5173`          |
| `pnpm build`       | Production build to `build/` (Node server)     |
| `pnpm start`       | Serve the production build                     |
| `pnpm build:spa`   | Static SPA build to `build/client`, no server  |
| `pnpm preview:spa` | Serve the SPA build at `http://localhost:4173` |
| `pnpm fmt`         | Format everything                              |
| `pnpm test`        | Run the tests once (`pnpm vitest` to watch)    |
| `pnpm check`       | Format check, lint, typecheck and tests        |
| `pnpm typecheck`   | Generate route types and run `tsc`             |
| `pnpm favicon`     | Rebuild `public/favicon.ico` from its SVG      |

`pnpm check` is the same command CI runs. With another package manager, run the same scripts with `npm run`, `yarn` or `bun run`.

## Making it yours

1. Run `pnpm make-it-yours` (or `npm run make-it-yours`). It sets the name, description and public URL in `app/lib/site.ts` and `package.json`, resets versioning to `0.1.0` (`package.json` and `.release-please-manifest.json`) so release-please starts fresh, records the template release in `TEMPLATE_VERSION`, replaces this README, deletes `CHANGELOG.md`, and removes itself.
2. Swap the hero image and its photographer credit.
3. Add routes in `app/routes/` (register them in `app/routes.ts`) and components with `pnpm dlx shadcn@latest add <component>`.
4. Replace the favicon. Edit `assets/favicon-tile.svg`, then run `pnpm favicon`.

For automated releases, turn on **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**. Use [Conventional Commits](https://www.conventionalcommits.org/) and squash-merge PRs with a conventional title: `feat:` and `fix:` commits open a release PR, and merging it tags and publishes the release. If you don't want this, delete `.github/workflows/release-please.yml`.

## Going deeper

| Page                                                                                                    | Covers                                              |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Call Sheet](https://felton.github.io/thats-your-cue/docs/call-sheet/)                                  | Getting started, scripts, agents                    |
| [Testing](https://felton.github.io/thats-your-cue/docs/call-sheet/#testing)                             | Where tests go, the `createRoutesStub` pattern      |
| [Environment variables](https://felton.github.io/thats-your-cue/docs/call-sheet/#environment-variables) | `.env`, `SPA`, `VITE_*` (never secrets)             |
| [Blocking](https://felton.github.io/thats-your-cue/docs/blocking/)                                      | Project structure, routes, layouts, rendering modes |
| [Props](https://felton.github.io/thats-your-cue/docs/props/)                                            | Every shipped component, live, with source          |
| [Wardrobe](https://felton.github.io/thats-your-cue/docs/wardrobe/)                                      | Theme tokens, dark mode, fonts, hero, favicon       |
| [Wrap](https://felton.github.io/thats-your-cue/docs/wrap/)                                              | Building, static hosting, GitHub Pages, FAQ         |

## License

[MIT](LICENSE)

---

Hero photo by [stefano stacchini](https://unsplash.com/@stak59) on [Unsplash](https://unsplash.com).
