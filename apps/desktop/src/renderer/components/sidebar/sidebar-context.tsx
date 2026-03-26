import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

interface TransitionIconState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  animating: boolean;
}

interface SidebarContextValue {
  isOpen: boolean;
  sidebarIconHidden: boolean;
  transitionIcon: TransitionIconState | null;
  toggleSidebar: () => void;
  panelRef: React.RefObject<PanelImperativeHandle | null>;
  panelElementRef: React.RefObject<HTMLDivElement | null>;
  sidebarToggleRef: React.RefObject<HTMLButtonElement | null>;
  toolbarToggleRef: React.RefObject<HTMLButtonElement | null>;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

const PANEL_SLIDE_MS = 200;

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sidebarIconHidden, setSidebarIconHidden] = useState(false);
  const [transitionIcon, setTransitionIcon] = useState<TransitionIconState | null>(null);
  const panelRef = useRef<PanelImperativeHandle | null>(null);
  const panelElementRef = useRef<HTMLDivElement | null>(null);
  const sidebarToggleRef = useRef<HTMLButtonElement | null>(null);
  const toolbarToggleRef = useRef<HTMLButtonElement | null>(null);
  const animatingRef = useRef(false);
  const lastWidthRef = useRef(280);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const toggleSidebar = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const panel = panelRef.current;
    const el = panelElementRef.current;
    const open = isOpenRef.current;

    if (open) {
      // CLOSING: hide real icon, show floating clone, collapse panel simultaneously
      // Store current width before collapsing so we know where to animate back to
      const currentSize = panel?.getSize();
      if (currentSize && currentSize.inPixels > 0) {
        lastWidthRef.current = currentSize.inPixels;
      }

      setSidebarIconHidden(true);

      const sourceRect = sidebarToggleRef.current?.getBoundingClientRect();
      if (sourceRect) {
        setTransitionIcon({
          x: sourceRect.left,
          y: sourceRect.top,
          targetX: 78,
          targetY: sourceRect.top,
          animating: false,
        });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionIcon((prev) => (prev ? { ...prev, animating: true } : null));
          });
        });
      }

      if (el) el.style.transition = `flex ${PANEL_SLIDE_MS}ms ease-in-out`;
      if (panel) panel.collapse();

      setTimeout(() => {
        if (el) el.style.transition = "";
        setTransitionIcon(null);
        setIsOpen(false);
        animatingRef.current = false;
      }, PANEL_SLIDE_MS + 50);
    } else {
      // OPENING: hide toolbar icon, show floating clone, expand panel simultaneously
      setSidebarIconHidden(true);

      const sourceRect = toolbarToggleRef.current?.getBoundingClientRect();
      // Target: button is at justify-end px-2 inside the sidebar
      const targetX = lastWidthRef.current - 8 - 28;

      if (sourceRect) {
        setTransitionIcon({
          x: sourceRect.left,
          y: sourceRect.top,
          targetX,
          targetY: sourceRect.top,
          animating: false,
        });
      }

      setIsOpen(true);
      if (el) el.style.transition = `flex ${PANEL_SLIDE_MS}ms ease-in-out`;
      if (panel) panel.expand();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionIcon((prev) => (prev ? { ...prev, animating: true } : null));
        });
      });

      setTimeout(() => {
        if (el) el.style.transition = "";
        setTransitionIcon(null);
        setSidebarIconHidden(false);
        animatingRef.current = false;
      }, PANEL_SLIDE_MS + 50);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        sidebarIconHidden,
        transitionIcon,
        toggleSidebar,
        panelRef,
        panelElementRef,
        sidebarToggleRef,
        toolbarToggleRef,
        setIsOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
