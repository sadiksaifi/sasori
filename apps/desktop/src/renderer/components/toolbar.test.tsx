import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, it, expect } from "vitest";
import { Toolbar } from "./toolbar";
import { SidebarProvider } from "./sidebar/sidebar-context";

afterEach(cleanup);

function renderToolbar({ defaultOpen = true }: { defaultOpen?: boolean } = {}) {
  return render(
    <SidebarProvider defaultOpen={defaultOpen}>
      <Toolbar />
    </SidebarProvider>,
  );
}

describe("Toolbar", () => {
  it("renders as a drag region with toolbar height", () => {
    renderToolbar();
    const toolbar = screen.getByRole("banner");
    expect(toolbar.className).toContain("drag-region");
    expect(toolbar.className).toContain("h-toolbar");
  });

  it("does not add traffic-light padding when sidebar is open", () => {
    renderToolbar();
    const toolbar = screen.getByRole("banner");
    expect(toolbar.className).not.toContain("pl-[78px]");
  });

  it("adds traffic-light padding when sidebar is collapsed", () => {
    renderToolbar({ defaultOpen: false });
    const toolbar = screen.getByRole("banner");
    expect(toolbar.className).toContain("pl-[78px]");
  });

  it("shows toggle button only when sidebar is collapsed", () => {
    renderToolbar({ defaultOpen: true });
    expect(screen.queryByRole("button", { name: /toggle sidebar/i })).not.toBeInTheDocument();

    cleanup();

    renderToolbar({ defaultOpen: false });
    const toggleBtn = screen.getByRole("button", { name: /toggle sidebar/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn.className).toContain("no-drag");
  });

  it("clicking toggle button opens sidebar and removes padding", async () => {
    const user = userEvent.setup();
    renderToolbar({ defaultOpen: false });

    const toggleBtn = screen.getByRole("button", { name: /toggle sidebar/i });
    await user.click(toggleBtn);

    const toolbar = screen.getByRole("banner");
    expect(toolbar.className).not.toContain("pl-[78px]");
    expect(screen.queryByRole("button", { name: /toggle sidebar/i })).not.toBeInTheDocument();
  });
});
