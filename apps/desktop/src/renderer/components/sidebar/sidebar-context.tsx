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

const TRANSITION_DURATION = 150;

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelRef = useRef<PanelImperativeHandle | null>(null);
  const panelElementRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = useCallback(() => {
    const panel = panelRef.current;
    const el = panelElementRef.current;

    // Add transition for smooth animation during programmatic toggle
    if (el) {
      el.style.transition = `flex ${TRANSITION_DURATION}ms ease-out`;
      setTimeout(() => {
        el.style.transition = "";
      }, TRANSITION_DURATION + 50);
    }

    if (panel) {
      if (isOpen) {
        panel.collapse();
      } else {
        panel.expand();
      }
    }
    setIsOpen((prev) => !prev);
  }, [isOpen]);

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
