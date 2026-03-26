import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Sidebar,
  SidebarHeader,
  SidebarFixedItem,
  SidebarContent,
  SidebarFooter,
} from "./sidebar";

describe("Sidebar", () => {
  it("renders all four sections as children", () => {
    render(
      <Sidebar>
        <SidebarHeader>Header Content</SidebarHeader>
        <SidebarFixedItem>Fixed Item</SidebarFixedItem>
        <SidebarContent>Scrollable Content</SidebarContent>
        <SidebarFooter>Footer Content</SidebarFooter>
      </Sidebar>,
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Fixed Item")).toBeInTheDocument();
    expect(screen.getByText("Scrollable Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("SidebarContent is scrollable (overflow-y-auto)", () => {
    render(
      <Sidebar>
        <SidebarContent data-testid="content">Items</SidebarContent>
      </Sidebar>,
    );

    const content = screen.getByTestId("content");
    expect(content.className).toContain("overflow-y-auto");
  });

  it("SidebarHeader and SidebarFooter are not scrollable (shrink-0)", () => {
    render(
      <Sidebar>
        <SidebarHeader data-testid="header">Top</SidebarHeader>
        <SidebarFooter data-testid="footer">Bottom</SidebarFooter>
      </Sidebar>,
    );

    expect(screen.getByTestId("header").className).toContain("shrink-0");
    expect(screen.getByTestId("footer").className).toContain("shrink-0");
  });

  it("SidebarFixedItem is shrink-0", () => {
    render(
      <Sidebar>
        <SidebarFixedItem data-testid="fixed">Fixed</SidebarFixedItem>
      </Sidebar>,
    );

    expect(screen.getByTestId("fixed").className).toContain("shrink-0");
  });
});
