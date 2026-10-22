import type { Config } from "@react-router/dev/config";

import { site } from "./app/lib/site";

// Server-rendered by default. `pnpm build:spa` sets SPA=true to build a static
// single-page app instead: build/client/index.html, no Node server needed.
const spa = process.env.SPA === "true";

export default {
  ssr: !spa,
  // The subpath of site.url, so routes match where the site is served. Keep in
  // step with `base` in vite.config.ts.
  basename: site.url ? new URL(site.url).pathname.replace(/\/?$/, "/") : "/",
  buildEnd() {
    if (!site.url) {
      console.warn(
        "site.url in app/lib/site.ts is empty, so social images and canonical links are skipped.",
      );
    }
  },
} satisfies Config;
