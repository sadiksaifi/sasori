import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  /** Whether toolbar should have traffic-light inset padding */
  toolbarInset: boolean;
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

export const PANEL_SLIDE_MS = 200;
export const TRAFFIC_LIGHT_ZONE = 78;

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [toolbarInset, setToolbarInset] = useState(!defaultOpen);
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
      // CLOSING
      const currentSize = panel?.getSize();
      if (currentSize && currentSize.inPixels > 0) {
        lastWidthRef.current = currentSize.inPixels;
      }

      setSidebarIconHidden(true);
      // Apply toolbar inset padding NOW so it transitions with the panel slide
      setToolbarInset(true);

      const sourceRect = sidebarToggleRef.current?.getBoundingClientRect();
      if (sourceRect) {
        setTransitionIcon({
          x: sourceRect.left,
          y: sourceRect.top,
          targetX: TRAFFIC_LIGHT_ZONE,
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
      // OPENING
      setSidebarIconHidden(true);
      // Remove toolbar inset padding NOW so it transitions with the panel slide
      setToolbarInset(false);

      const sourceRect = toolbarToggleRef.current?.getBoundingClientRect();
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
        setIsOpen(true);
        setSidebarIconHidden(false);
        animatingRef.current = false;
      }, PANEL_SLIDE_MS + 50);
    }
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      toolbarInset,
      sidebarIconHidden,
      transitionIcon,
      toggleSidebar,
      panelRef,
      panelElementRef,
      sidebarToggleRef,
      toolbarToggleRef,
      setIsOpen,
    }),
    [isOpen, toolbarInset, sidebarIconHidden, transitionIcon, toggleSidebar, setIsOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
