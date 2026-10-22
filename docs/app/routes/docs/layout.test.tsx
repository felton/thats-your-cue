import { render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";

import { docs } from "~/content/nav";

import DocsLayout from "./layout";

beforeAll(() => {
  // jsdom has neither: the sidebar checks the viewport, the table of contents
  // tracks the visible heading.
  window.IntersectionObserver ??= class {
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList;
});

function renderAt(path: string) {
  const Stub = createRoutesStub([
    { Component: DocsLayout, children: [{ path: "/docs/:slug", Component: () => <p>body</p> }] },
  ]);
  render(<Stub initialEntries={[path]} />);
}

describe("docs layout", () => {
  it("lists every page in the sidebar, in order", async () => {
    renderAt("/docs/blocking");
    const nav = await screen.findByText("Docs", { selector: "[data-sidebar=group-label]" });
    const links = within(nav.parentElement!).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(docs.map((d) => `/docs/${d.slug}`));
  });

  it("titles the page and links its neighbours", async () => {
    renderAt("/docs/blocking");
    expect((await screen.findByRole("heading", { level: 1 })).textContent).toBe("Blocking");
    expect(screen.getByRole("link", { name: "Call Sheet" }).getAttribute("href")).toBe(
      "/docs/call-sheet",
    );
    expect(screen.getByRole("link", { name: "Props" }).getAttribute("href")).toBe("/docs/props");
    expect(
      screen.getByRole("link", { name: "Edit this page on GitHub" }).getAttribute("href"),
    ).toMatch(/\/blob\/main\/docs\/app\/content\/blocking\.mdx$/);
  });
});
