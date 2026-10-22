import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const dir = path.resolve("app/content");

describe("page content", () => {
  it("never hard-codes a template release", () => {
    // Write __TEMPLATE_VERSION__ (or template-v__TEMPLATE_VERSION__) instead: the MDX build fills it in from TEMPLATE_VERSION.
    const hits = readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .flatMap((f) =>
        readFileSync(path.join(dir, f), "utf8")
          .split("\n")
          .flatMap((line, i) =>
            /\bv\d+\.\d+\.\d+\b/.test(line) ? [`${f}:${i + 1}: ${line}`] : [],
          ),
      );
    expect(hits).toEqual([]);
  });
});
