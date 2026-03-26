import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { SidebarProvider, useSidebar } from "./sidebar-context";

describe("SidebarProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("provides isOpen=true by default", () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("toggleSidebar hides icon and collapses panel", () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.toggleSidebar();
    });

    // Icon hidden immediately, isOpen still true during animation
    expect(result.current.sidebarIconHidden).toBe(true);
    expect(result.current.isOpen).toBe(true);

    // After animation completes
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("toggleSidebar flips back to true on second call", () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });

    // Close
    act(() => {
      result.current.toggleSidebar();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.isOpen).toBe(false);

    // Open — isOpen true immediately, icon hidden until panel expands
    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.sidebarIconHidden).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.sidebarIconHidden).toBe(false);
  });

  it("throws when useSidebar is used outside SidebarProvider", () => {
    expect(() => {
      renderHook(() => useSidebar());
    }).toThrow();
  });
});
