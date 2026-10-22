// With a `basename`, React Router writes pre-rendered pages to
// build/client/<basename>/… while assets stay in build/client/assets/.
// GitHub Pages serves build/client at /<repo>/, so move the pages up a level.
// https://github.com/remix-run/react-router/issues/14587
import { cp, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

import { site } from "../app/lib/site.ts";

const client = path.resolve("build/client");
const nested = path.join(client, new URL(site.url).pathname);

try {
  await stat(nested);
} catch {
  console.error(`flatten-prerender: ${nested} not found; nothing to move.`);
  process.exit(1);
}

// React Router renames its SPA fallback to build/client/index.html because no
// page exists there yet. The real home page replaces it.
await rm(path.join(client, "index.html"));
await cp(nested, client, { recursive: true });
await rm(nested, { recursive: true });

// Pages serves 404.html for unknown URLs. /404 is pre-rendered from the
// catch-all route, which matches any unknown URL, so it hydrates cleanly.
await rename(path.join(client, "404", "index.html"), path.join(client, "404.html"));
await rm(path.join(client, "404"), { recursive: true });
console.log("flatten-prerender: moved pages into build/client and wrote 404.html");
