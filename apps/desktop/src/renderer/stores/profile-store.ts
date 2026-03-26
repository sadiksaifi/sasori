import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  lastActiveProjectId: string | null;
  lastActiveSessionId: string | null;

  setActiveProject: (id: string | null) => void;
  setActiveSession: (projectId: string | null, sessionId: string | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      lastActiveProjectId: null,
      lastActiveSessionId: null,

      setActiveProject: (id) => {
        set({ lastActiveProjectId: id });
      },

      setActiveSession: (projectId, sessionId) => {
        set({
          lastActiveProjectId: projectId,
          lastActiveSessionId: sessionId,
        });
      },
    }),
    { name: "sasori-profile" },
  ),
);
