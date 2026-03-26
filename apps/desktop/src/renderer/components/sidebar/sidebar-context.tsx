import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface SidebarContextValue {
  isOpen: boolean;
  toggleSidebar: () => void;
  panelRef: React.RefObject<ImperativePanelHandle | null>;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelRef = useRef<ImperativePanelHandle | null>(null);

  const toggleSidebar = useCallback(() => {
    const panel = panelRef.current;
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
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, panelRef, setIsOpen }}>
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
