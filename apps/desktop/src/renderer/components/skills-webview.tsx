import { useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowClockwiseIcon,
  GlobeSimpleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const SKILLS_ORIGIN = "https://skills.sh";

interface SkillsWebviewProps {
  initialPath?: string;
}

export function SkillsWebview({ initialPath }: SkillsWebviewProps) {
  const webviewRef = useRef<Electron.WebviewTag>(null);
  const [url, setUrl] = useState(`${SKILLS_ORIGIN}${initialPath ?? "/"}`);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const updateNavState = useCallback(() => {
    const wv = webviewRef.current;
    if (!wv) return;
    setCanGoBack(wv.canGoBack());
    setCanGoForward(wv.canGoForward());
    setUrl(wv.getURL());
  }, []);

  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv) return;

    const onNavigate = () => {
      setFailed(false);
      updateNavState();
    };
    const onStartLoading = () => {
      setLoading(true);
      setFailed(false);
    };
    const onStopLoading = () => {
      setLoading(false);
      updateNavState();
    };
    const onFailLoad = (e: Event) => {
      // Ignore aborted loads (e.g. navigating away before load completes)
      const errorCode = (e as Event & { errorCode: number }).errorCode;
      if (errorCode === -3) return;
      setLoading(false);
      setFailed(true);
    };
    const onNewWindow = (e: Event) => {
      e.preventDefault();
      const url = (e as Event & { url: string }).url;
      if (url.startsWith(SKILLS_ORIGIN)) {
        wv.loadURL(url);
      } else {
        window.conveyor.webcontent.openUrl({ url });
      }
    };

    wv.addEventListener("did-navigate", onNavigate);
    wv.addEventListener("did-navigate-in-page", onNavigate);
    wv.addEventListener("did-start-loading", onStartLoading);
    wv.addEventListener("did-stop-loading", onStopLoading);
    wv.addEventListener("did-fail-load", onFailLoad as EventListener);
    wv.addEventListener("new-window", onNewWindow);

    return () => {
      wv.removeEventListener("did-navigate", onNavigate);
      wv.removeEventListener("did-navigate-in-page", onNavigate);
      wv.removeEventListener("did-start-loading", onStartLoading);
      wv.removeEventListener("did-stop-loading", onStopLoading);
      wv.removeEventListener("did-fail-load", onFailLoad as EventListener);
      wv.removeEventListener("new-window", onNewWindow);
    };
  }, [updateNavState]);

  const handleBack = () => webviewRef.current?.goBack();
  const handleForward = () => webviewRef.current?.goForward();
  const handleReload = () => {
    setFailed(false);
    webviewRef.current?.reload();
  };

  const displayUrl = url.replace(SKILLS_ORIGIN, "").replace(/^\/$/, "") || "/";

  return (
    <div className="flex h-full flex-col">
      {/* Navigation bar */}
      <div className="flex h-control-lg items-center gap-1 border-b border-separator bg-grouped-background px-2">
        <NavButton onClick={handleBack} disabled={!canGoBack} aria-label="Go back">
          <ArrowLeftIcon size={14} />
        </NavButton>
        <NavButton onClick={handleForward} disabled={!canGoForward} aria-label="Go forward">
          <ArrowRightIcon size={14} />
        </NavButton>
        <NavButton onClick={handleReload} aria-label="Reload">
          <ArrowClockwiseIcon size={14} />
        </NavButton>

        <div className="flex min-w-0 flex-1 items-center gap-1 px-1.5">
          <GlobeSimpleIcon size={12} className="shrink-0 text-quaternary-label" />
          <span className="truncate text-callout text-secondary-label">{displayUrl}</span>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="h-0.5 w-full bg-grouped-background">
          <div className="h-full animate-pulse bg-accent" style={{ width: "40%" }} />
        </div>
      )}

      {/* Webview or error state */}
      {failed ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-related">
          <p className="text-title-2 text-label">Could not load Skills</p>
          <p className="text-body text-secondary-label">Check your connection and try again.</p>
          <button
            type="button"
            onClick={handleReload}
            className="mt-2 rounded-sm bg-accent px-3 py-1 text-callout text-white transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <webview
          ref={webviewRef}
          src={`${SKILLS_ORIGIN}${initialPath ?? "/"}`}
          partition="persist:skills"
          className="flex-1"
          style={{ minHeight: 0 }}
        />
      )}
    </div>
  );
}

function NavButton({
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-xs text-secondary-label transition-colors",
        disabled ? "text-quaternary-label" : "hover:bg-sidebar-hover active:bg-sidebar-hover/80",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
