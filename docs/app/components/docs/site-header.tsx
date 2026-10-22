import { Clapperboard } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { GitHubIcon } from "~/components/docs/github-icon";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { REPO_URL } from "~/content/nav";
import { templateVersion } from "~/lib/template-version";

/** Top bar shared by the home page and the docs. `leading` holds the sidebar trigger on docs pages. */
export function SiteHeader({ leading }: { leading?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <div className="flex h-14 items-center gap-2 px-4">
        {leading}
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Clapperboard strokeWidth={1.5} /> that's your cue
        </Link>
        <Badge variant="secondary" className="max-sm:hidden">
          v{templateVersion}
        </Badge>
        <nav className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" render={<Link to="/docs/call-sheet" />}>
            Docs
          </Button>
          <Button variant="ghost" size="icon" render={<a href={REPO_URL} aria-label="GitHub" />}>
            <GitHubIcon />
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
