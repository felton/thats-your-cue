import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { site } from "./app/lib/site.ts";

export default defineConfig({
  // The subpath of site.url, so asset URLs match where the site is served. Keep
  // in step with `basename` in react-router.config.ts.
  base: site.url ? new URL(site.url).pathname.replace(/\/?$/, "/") : "/",
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
