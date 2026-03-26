import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable";

afterEach(cleanup);

describe("Resizable", () => {
  it("renders PanelGroup with panels and handle", () => {
    render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>,
    );

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("ResizableHandle has separator styling", () => {
    render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>A</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>B</ResizablePanel>
      </ResizablePanelGroup>,
    );

    const handle = screen.getByRole("separator");
    expect(handle.className).toContain("bg-opaque-separator");
  });
});
