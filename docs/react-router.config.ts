import type { Config } from "@react-router/dev/config";

import { site } from "./app/lib/site";

// Static, pre-rendered build for GitHub Pages, served under the subpath of site.url.
// Pre-rendered pages land in build/client/thats-your-cue/; scripts/flatten-prerender.mjs
// moves them up next to the assets after the build.
export default {
  ssr: false,
  // Every static path, plus /404: it matches the catch-all route and becomes 404.html.
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), "/404"];
  },
  // The subpath of site.url. Keep in step with `base` in vite.config.ts.
  basename: site.url ? new URL(site.url).pathname.replace(/\/?$/, "/") : "/",
} satisfies Config;
