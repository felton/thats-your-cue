import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { docPath, editUrl, type DocPage } from "~/content/nav";

export function PrevNext({ page, prev, next }: { page: DocPage; prev?: DocPage; next?: DocPage }) {
  return (
    <div className="mt-12 flex flex-col gap-6 border-t pt-6">
      <div className="flex justify-between gap-4">
        {prev ? (
          <Button variant="outline" render={<Link to={docPath(prev.slug)} />}>
            <ArrowLeft data-icon="inline-start" />
            {prev.title}
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button variant="outline" render={<Link to={docPath(next.slug)} />}>
            {next.title}
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </div>
      <a
        href={editUrl(page.slug)}
        className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        Edit this page on GitHub
      </a>
    </div>
  );
}
