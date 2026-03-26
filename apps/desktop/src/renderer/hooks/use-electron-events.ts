import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useSidebar } from "@/components/sidebar";

export function useElectronEvents(): void {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    window.electron.onNavigate((path) => {
      router.navigate({ to: path });
    });

    window.electron.onToggleSidebar(() => {
      toggleSidebar();
    });
  }, [router, toggleSidebar]);
}
