import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SidebarProvider, useSidebar } from "./sidebar-context";

describe("SidebarProvider", () => {
  it("provides isOpen=true by default", () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("toggleSidebar flips isOpen to false", () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("toggleSidebar flips back to true on second call", () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.toggleSidebar();
    });
    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("throws when useSidebar is used outside SidebarProvider", () => {
    expect(() => {
      renderHook(() => useSidebar());
    }).toThrow();
  });
});
