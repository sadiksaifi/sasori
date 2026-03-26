import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

interface SidebarContextValue {
  isOpen: boolean;
  sidebarIconHidden: boolean;
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

const ICON_FADE_MS = 100;
const PANEL_SLIDE_MS = 150;

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sidebarIconHidden, setSidebarIconHidden] = useState(false);
  const panelRef = useRef<PanelImperativeHandle | null>(null);
  const panelElementRef = useRef<HTMLDivElement | null>(null);
  const animatingRef = useRef(false);

  const toggleSidebar = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const panel = panelRef.current;
    const el = panelElementRef.current;

    if (isOpen) {
      // CLOSING: icon fades out first → then panel collapses
      setSidebarIconHidden(true);
      setTimeout(() => {
        if (el) {
          el.style.transition = `flex ${PANEL_SLIDE_MS}ms ease-out`;
        }
        if (panel) panel.collapse();
        setTimeout(() => {
          if (el) el.style.transition = "";
          setIsOpen(false);
          animatingRef.current = false;
        }, PANEL_SLIDE_MS + 50);
      }, ICON_FADE_MS);
    } else {
      // OPENING: panel expands first → then icon fades in
      setSidebarIconHidden(true);
      setIsOpen(true);
      if (el) {
        el.style.transition = `flex ${PANEL_SLIDE_MS}ms ease-out`;
      }
      if (panel) panel.expand();
      setTimeout(() => {
        if (el) el.style.transition = "";
        setSidebarIconHidden(false);
        animatingRef.current = false;
      }, PANEL_SLIDE_MS + 50);
    }
  }, [isOpen]);

  return (
    <SidebarContext.Provider
      value={{ isOpen, sidebarIconHidden, toggleSidebar, panelRef, panelElementRef, setIsOpen }}
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
