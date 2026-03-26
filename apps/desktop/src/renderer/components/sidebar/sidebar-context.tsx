import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

interface SidebarContextValue {
  isOpen: boolean;
  toggleSidebar: () => void;
  panelRef: React.RefObject<PanelImperativeHandle | null>;
  panelElementRef: React.RefObject<HTMLDivElement | null>;
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
  const panelRef = useRef<PanelImperativeHandle | null>(null);
  const panelElementRef = useRef<HTMLDivElement | null>(null);
  const animatingRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const toggleSidebar = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const panel = panelRef.current;
    const el = panelElementRef.current;
    const open = isOpenRef.current;

    if (el) {
      el.style.transition = `flex ${PANEL_SLIDE_MS}ms ease-in-out`;
    }

    if (open) {
      // CLOSING: panel collapses, icon rides with it naturally
      if (panel) panel.collapse();
      setTimeout(() => {
        if (el) el.style.transition = "";
        setIsOpen(false);
        animatingRef.current = false;
      }, PANEL_SLIDE_MS + 50);
    } else {
      // OPENING: panel expands, icon slides in naturally
      setIsOpen(true);
      if (panel) panel.expand();
      setTimeout(() => {
        if (el) el.style.transition = "";
        animatingRef.current = false;
      }, PANEL_SLIDE_MS + 50);
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, toggleSidebar, panelRef, panelElementRef, setIsOpen }}
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
