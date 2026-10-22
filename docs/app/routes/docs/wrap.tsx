import { mdxComponents } from "~/components/docs/mdx-components";
import Content from "~/content/wrap.mdx";
import { docMeta } from "~/content/nav";

import type { Route } from "./+types/wrap";

export function meta(_args: Route.MetaArgs) {
  return docMeta("wrap");
}

export default function Wrap() {
  return <Content components={mdxComponents} />;
}
