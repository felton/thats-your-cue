# That's your cue docs

**This is `docs/`: the docs site, not the template.** It's a project made from the template, pre-rendered and deployed to GitHub Pages at https://felton.github.io/thats-your-cue/ by `.github/workflows/docs.yml` at the repo root. Template changes belong in `../template`. The repo root's `AGENTS.md` covers the monorepo.

## Docs-site rules

- `app/components/ui/` is vendored from the template release in `TEMPLATE_VERSION`. Don't edit the template's components here: change them in `../template`, release, bump `TEMPLATE_VERSION`, run `pnpm sync:template` on a clean tree. It reads the `template-v…` tag, not `../template`, so the docs only show released code. It also three-way merges the template's changes into the customized files listed in `merged` in `scripts/sync-template.mjs` (resolve any conflicts it reports) and matches shared dependency versions. Components added only for the docs are listed in `docsOnly` in `scripts/sync-template.mjs`; add new ones there.
- Never hard-code a template release in `app/content`: write `__TEMPLATE_VERSION__` (or `template-v__TEMPLATE_VERSION__` for a tag), which the MDX build fills in from `TEMPLATE_VERSION`. A test enforces this.
- Page bodies are MDX in `app/content/`. `app/content/nav.ts` is the page list (sidebar, prev/next, edit links); add a page there and in `app/routes.ts`.
- The site is served under `/thats-your-cue/`. Link with `<Link>` (or root-relative Markdown links, which MDX maps to `<Link>`), never a hard-coded `href="/..."`.
- `pnpm build` runs `scripts/flatten-prerender.mjs` after React Router: it moves pages out of `build/client/thats-your-cue/` and writes `404.html`.
- No actions or runtime loaders: loaders run once at build time.
- Docs pages set their page tags with `docMeta()` from `app/content/nav.ts` in a `meta` export. Keep that here, even though the template's notes prefer `<title>` elements: the site-wide tags are in `root.tsx`, so nothing is lost.
- `app/lib/site.ts` is this site's own, not synced from the template. `scripts/flatten-prerender.mjs` reads the subpath from `site.url`.

## The template's notes

Everything else follows [`../template/AGENTS.md`](../template/AGENTS.md): the stack, commands, layout, conventions and testing. Two of its sections don't apply here: "Working from a brief" (this site is already set up) and "Commits and releases" (the docs aren't released; the root `AGENTS.md` covers releases). It describes the template on `main`, which can be ahead of the release in `TEMPLATE_VERSION` that `app/components/ui/` comes from. Its skills are at the repo root's `.agents/skills/`, which links to the template's.
