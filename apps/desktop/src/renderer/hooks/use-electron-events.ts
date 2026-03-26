import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useSidebar } from "@/components/sidebar";

export function useElectronEvents(): void {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    return window.electron.onNavigate((path) => {
      router.navigate({ to: path });
    });
  }, [router]);

  useEffect(() => {
    const cleanup = window.electron.onToggleSidebar(() => {
      toggleSidebar();
    });
    return cleanup;
  }, [toggleSidebar]);
}
