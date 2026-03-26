import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { House } from "@phosphor-icons/react";

// Mock router — "/" is the active route
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useMatchRoute: () => (params: { to: string }) => params.to === "/",
}));

import { SidebarLink } from "./sidebar-link";

describe("SidebarLink", () => {
  it("renders filled icon for active route", () => {
    const { container } = render(<SidebarLink item={{ to: "/", label: "Home", icon: House }} />);
    // Phosphor "regular" renders an outlined path with inner cutouts (longer d attribute)
    // Phosphor "fill" renders a solid path (shorter d attribute, no inner cutouts)
    // The fill path for House starts with "M224,120v96" while regular starts with "M219.31,108.68"
    const path = container.querySelector("svg path");
    expect(path?.getAttribute("d")).toMatch(/^M224/);
  });

  it("renders regular icon for inactive route", () => {
    const { container } = render(
      <SidebarLink item={{ to: "/settings", label: "Settings", icon: House }} />,
    );
    const path = container.querySelector("svg path");
    expect(path?.getAttribute("d")).toMatch(/^M219/);
  });
});
