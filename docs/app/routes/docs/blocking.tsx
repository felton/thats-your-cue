import { mdxComponents } from "~/components/docs/mdx-components";
import Content from "~/content/blocking.mdx";
import { docMeta } from "~/content/nav";

import type { Route } from "./+types/blocking";

export function meta(_args: Route.MetaArgs) {
  return docMeta("blocking");
}

export default function Blocking() {
  return <Content components={mdxComponents} />;
}
