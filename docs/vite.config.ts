import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

import { site } from "./app/lib/site.ts";

const templateVersion = readFileSync("TEMPLATE_VERSION", "utf8").trim();

type MdNode = { type: string; value?: string; url?: string; children?: MdNode[] };

/**
 * Replaces __TEMPLATE_VERSION__ in MDX text, inline code, code blocks and link
 * URLs with the version in TEMPLATE_VERSION, so pages never hard-code a release.
 * (MDX `{expressions}` don't work inside code blocks.)
 */
function remarkTemplateVersion() {
  const replace = (node: MdNode) => {
    if (typeof node.value === "string") {
      node.value = node.value.replaceAll("__TEMPLATE_VERSION__", templateVersion);
    }
    if (typeof node.url === "string") {
      node.url = node.url.replaceAll("__TEMPLATE_VERSION__", templateVersion);
    }
    node.children?.forEach(replace);
  };
  return replace;
}

export default defineConfig({
  // The subpath of site.url, so asset URLs match where the site is served. Keep
  // in step with `basename` in react-router.config.ts.
  base: site.url ? new URL(site.url).pathname.replace(/\/?$/, "/") : "/",
  plugins: [
    tailwindcss(),
    {
      // Page bodies in app/content/*.mdx. Code blocks are highlighted here, at
      // build time, so no highlighter ships to the browser.
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm, remarkTemplateVersion],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [
            rehypeShiki,
            { themes: { light: "github-light", dark: "github-dark" }, defaultColor: false },
          ],
        ],
      }),
    },
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
    // tsconfigPaths only applies to TS/JS importers; .mdx files need the alias too.
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
});
