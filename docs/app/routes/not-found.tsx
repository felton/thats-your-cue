import { Link } from "react-router";

import { SiteFooter } from "~/components/docs/site-footer";
import { SiteHeader } from "~/components/docs/site-header";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "~/components/ui/empty";

import type { Route } from "./+types/not-found";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Not found · that's your cue" }, { name: "robots", content: "noindex" }];
}

// root.tsx leaves canonical and og:url off pages that set this.
export const handle = { canonical: false };

// Catch-all route, pre-rendered as /404 and shipped as 404.html. GitHub Pages
// serves that file for any unknown URL, and because this route also matches
// that URL in the browser, it hydrates without a mismatch.
export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              <h1>404</h1>
            </EmptyTitle>
            <EmptyDescription>That scene isn’t in the script.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link to="/" />}>Back to set</Button>
          </EmptyContent>
        </Empty>
      </main>
      <SiteFooter />
    </div>
  );
}
