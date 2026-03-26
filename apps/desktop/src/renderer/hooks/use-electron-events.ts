import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

export function useElectronEvents(): void {
  const router = useRouter();

  useEffect(() => {
    window.electron.onNavigate((path) => {
      router.navigate({ to: path });
    });
  }, [router]);
}
