import { create } from "zustand";

interface ProfileState {
  lastActiveProjectId: string | null;
  lastActiveSessionId: string | null;
  _hydrated: boolean;

  hydrate: () => Promise<void>;
  setActiveProject: (id: string | null) => void;
  setActiveSession: (projectId: string | null, sessionId: string | null) => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  lastActiveProjectId: null,
  lastActiveSessionId: null,
  _hydrated: false,

  hydrate: async () => {
    const [projectId, sessionId] = await Promise.all([
      window.conveyor.db.getSetting({ key: "last_active_project_id" }),
      window.conveyor.db.getSetting({ key: "last_active_session_id" }),
    ]);
    set({
      lastActiveProjectId: projectId,
      lastActiveSessionId: sessionId,
      _hydrated: true,
    });
  },

  setActiveProject: (id) => {
    set({ lastActiveProjectId: id });
    if (id) {
      window.conveyor.db.setSetting({ key: "last_active_project_id", value: id });
    }
  },

  setActiveSession: (projectId, sessionId) => {
    set({
      lastActiveProjectId: projectId,
      lastActiveSessionId: sessionId,
    });
    if (projectId) {
      window.conveyor.db.setSetting({ key: "last_active_project_id", value: projectId });
    }
    if (sessionId) {
      window.conveyor.db.setSetting({ key: "last_active_session_id", value: sessionId });
    }
  },
}));
