import { describe, expect, it } from "vitest";

import { shippedComponents } from "~/content/shipped";

import { demos } from "./component-demos";

describe("Props page demos", () => {
  it("covers every component the template ships", () => {
    expect(shippedComponents.length).toBeGreaterThan(0);
    const missing = shippedComponents.filter((name) => !(name in demos));
    expect(missing).toEqual([]);
  });
});
