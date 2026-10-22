import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { cn } from "~/lib/utils";

type Heading = { id: string; text: string; level: number };

/**
 * "On this page" list, built from the h2/h3 ids rehype-slug adds. It reads the
 * rendered page, so it fills in after hydration.
 */
export function Toc({ containerId }: { containerId: string }) {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const elements = Array.from(container.querySelectorAll<HTMLElement>("h2[id], h3[id]"));
    setHeadings(
      elements.map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        level: Number(el.tagName[1]),
      })),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-56px 0px -70% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerId, pathname]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-2 text-sm">
      <p className="font-medium">On this page</p>
      <ul className="flex flex-col gap-1.5">
        {headings.map((h) => (
          <li key={h.id} className={cn(h.level === 3 && "pl-3")}>
            <a
              href={`#${h.id}`}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                active === h.id && "text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
