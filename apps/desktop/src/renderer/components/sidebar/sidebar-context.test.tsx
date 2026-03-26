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

  it("toggleSidebar flips isOpen to false after panel slide", () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    });

    act(() => {
      result.current.toggleSidebar();
    });

    // isOpen stays true until panel slide completes
    expect(result.current.isOpen).toBe(true);

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

    // Open
    act(() => {
      result.current.toggleSidebar();
    });

    // isOpen becomes true immediately on open
    expect(result.current.isOpen).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });
  });

  it("throws when useSidebar is used outside SidebarProvider", () => {
    expect(() => {
      renderHook(() => useSidebar());
    }).toThrow();
  });
});
