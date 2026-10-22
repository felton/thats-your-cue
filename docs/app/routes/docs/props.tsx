import { codeToHtml } from "shiki";

import { ComponentPreview } from "~/components/docs/component-preview";
import { demos } from "~/components/docs/component-demos";
import { mdxComponents } from "~/components/docs/mdx-components";
import { docMeta } from "~/content/nav";
import Content from "~/content/props.mdx";
import { shippedComponents } from "~/content/shipped";

import type { Route } from "./+types/props";

export function meta(_args: Route.MetaArgs) {
  return docMeta("props");
}

// Runs at build time only (the site is pre-rendered), so Shiki never reaches the browser.
export async function loader() {
  const sources = import.meta.glob<string>("../../components/ui/*.tsx", {
    query: "?raw",
    import: "default",
    eager: true,
  });
  const components = await Promise.all(
    shippedComponents.map(async (name) => ({
      name,
      html: await codeToHtml(sources[`../../components/ui/${name}.tsx`] ?? "", {
        lang: "tsx",
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      }),
    })),
  );
  return { components };
}

export default function Props({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Content components={mdxComponents} />
      {loaderData.components.map(({ name, html }) => {
        const Demo = demos[name];
        return (
          <section key={name} className="mt-12 flex flex-col gap-4">
            <h2 id={name} className="scroll-mt-20 text-xl font-semibold tracking-tight">
              <a href={`#${name}`}>{name}</a>
            </h2>
            <p className="text-sm text-muted-foreground">
              <code>app/components/ui/{name}.tsx</code>
            </p>
            <ComponentPreview html={html}>{Demo ? <Demo /> : null}</ComponentPreview>
          </section>
        );
      })}
    </>
  );
}
