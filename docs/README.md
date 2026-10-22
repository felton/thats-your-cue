# That's your cue docs

The source of the docs site, published at <https://felton.github.io/thats-your-cue/>. It is not part of the template: `create` copies only `../template`.

The site is itself a project made from the template, at the release in `TEMPLATE_VERSION`.

- `pnpm dev`: dev server at `http://localhost:5173/thats-your-cue/`
- `pnpm build`: pre-rendered static site in `build/client`
- `pnpm check`: format, lint, typecheck, tests
- `pnpm sync:template`: update to the release in `TEMPLATE_VERSION`: re-copy the template's UI components, theme and `.nvmrc` from its `template-v…` tag, three-way merge the template's changes into the files this site customizes (`merged` in the script), and match the versions of the dependencies both projects share

`app/components/ui` is vendored from the template. Make template changes in `../template` and release them. Then, here: bump `TEMPLATE_VERSION`, run `pnpm sync:template`, resolve any merge conflicts it reports, review the diff, and open a PR. Pushes to `main` that touch `docs/` deploy through `.github/workflows/docs.yml` at the repo root.
