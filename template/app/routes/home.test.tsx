import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { site } from "../lib/site";
import Home from "./home";

describe("home route", () => {
  it("calls places", async () => {
    // Route components use <Link>, so render inside a stub router.
    const Stub = createRoutesStub([{ path: "/", Component: Home }]);
    render(<Stub initialEntries={["/"]} />);

    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Places, everyone.");
  });

  it("sets its page tags", async () => {
    // React hoists <title> and <meta> from the component into document.head.
    const Stub = createRoutesStub([{ path: "/", Component: Home }]);
    render(<Stub initialEntries={["/"]} />);

    await screen.findByRole("heading", { level: 1 });
    expect(document.title).toBe(site.name);
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      site.description,
    );
  });
});
