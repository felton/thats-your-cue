import { useRef, type ComponentProps } from "react";

import { cn } from "~/lib/utils";

import { CopyButton } from "./copy-button";

/** A `<pre>` from Shiki (or plain markup) with a copy button. */
export function CodeBlock({ className, ...props }: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <div className="group relative my-4">
      <pre
        ref={ref}
        className={cn("overflow-x-auto border bg-muted/40 p-4 text-sm leading-relaxed", className)}
        {...props}
      />
      <CopyButton
        text={() => ref.current?.textContent ?? ""}
        className="absolute top-2 right-2 bg-background/80 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
      />
    </div>
  );
}

/** Build-time-highlighted Shiki HTML (from a loader) with a copy button. */
export function HighlightedCode({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="group relative">
      <div
        ref={ref}
        className="[&_pre]:max-h-96 [&_pre]:overflow-auto [&_pre]:border [&_pre]:bg-muted/40 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed"
        // Our own component source, highlighted by Shiki at build time.
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton
        text={() => ref.current?.textContent ?? ""}
        className="absolute top-2 right-4 bg-background/80 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
      />
    </div>
  );
}
