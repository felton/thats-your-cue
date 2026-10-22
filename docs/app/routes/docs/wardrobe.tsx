import { mdxComponents } from "~/components/docs/mdx-components";
import Content from "~/content/wardrobe.mdx";
import { docMeta } from "~/content/nav";

import type { Route } from "./+types/wardrobe";

export function meta(_args: Route.MetaArgs) {
  return docMeta("wardrobe");
}

export default function Wardrobe() {
  return <Content components={mdxComponents} />;
}
