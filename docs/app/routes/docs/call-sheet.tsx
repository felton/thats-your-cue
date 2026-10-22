import { mdxComponents } from "~/components/docs/mdx-components";
import Content from "~/content/call-sheet.mdx";
import { docMeta } from "~/content/nav";

import type { Route } from "./+types/call-sheet";

export function meta(_args: Route.MetaArgs) {
  return docMeta("call-sheet");
}

export default function CallSheet() {
  return <Content components={mdxComponents} />;
}
