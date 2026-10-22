import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import Home from "./home";

describe("home route", () => {
  it("calls places", async () => {
    // Route components use <Link>, so render inside a stub router.
    const Stub = createRoutesStub([{ path: "/", Component: Home }]);
    render(<Stub initialEntries={["/"]} />);

    const heading = await screen.findByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Places, everyone.");
  });
});
