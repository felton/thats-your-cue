import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Link } from "react-router";

import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { CodeBlock } from "./code-block";

/**
 * Maps the HTML that MDX produces to the template's components and type styles.
 * Root-relative links go through <Link> so they pick up the /thats-your-cue/ basename.
 */
export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="text-3xl font-semibold tracking-tight" {...props} />,
  h2: (props) => (
    <h2 className="mt-12 scroll-mt-20 text-xl font-semibold tracking-tight" {...props} />
  ),
  h3: (props) => <h3 className="mt-8 scroll-mt-20 font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  ul: (props) => <ul className="mt-4 ml-6 list-disc [&>li]:mt-2" {...props} />,
  ol: (props) => <ol className="mt-4 ml-6 list-decimal [&>li]:mt-2" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-4 border-l-2 pl-4 text-muted-foreground" {...props} />
  ),
  hr: () => <Separator className="my-8" />,
  a: ({ href = "", ...props }: ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link to={href} className="font-medium underline underline-offset-4" {...props} />
    ) : (
      <a href={href} className="font-medium underline underline-offset-4" {...props} />
    ),
  pre: CodeBlock,
  table: (props) => (
    <div className="mt-4">
      <Table {...props} />
    </div>
  ),
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
};
