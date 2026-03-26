import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  path: string;
  createdAt: string;
}

export interface Session {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  sessions: Session[];
  expandedProjectIds: string[];
  _hydrated: boolean;

  hydrate: () => Promise<void>;
  addProject: (path: string) => Promise<Project | null>;
  removeProject: (id: string) => Promise<void>;
  createSession: (projectId: string) => Promise<Session>;
  deleteSession: (id: string) => Promise<void>;
  expandProject: (id: string) => void;
  toggleProjectExpanded: (id: string) => void;
  getProjectSessions: (projectId: string) => Session[];
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  sessions: [],
  expandedProjectIds: [],
  _hydrated: false,

  hydrate: async () => {
    const [projects, sessions] = await Promise.all([
      window.conveyor.db.getAllProjects(),
      window.conveyor.db.getAllSessions(),
    ]);
    set({ projects, sessions, _hydrated: true });
  },

  addProject: async (path: string) => {
    const { projects } = get();
    if (projects.some((p) => p.path === path)) return null;

    const name = path.split("/").pop() ?? path;
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      path,
      createdAt: new Date().toISOString(),
    };

    set({ projects: [...projects, project] });

    const { success } = await window.conveyor.db.addProject(project);
    if (!success) {
      set({ projects: projects });
      return null;
    }

    return project;
  },

  removeProject: async (id: string) => {
    const { projects, sessions, expandedProjectIds } = get();

    set({
      projects: projects.filter((p) => p.id !== id),
      sessions: sessions.filter((s) => s.projectId !== id),
      expandedProjectIds: expandedProjectIds.filter((eid) => eid !== id),
    });

    try {
      await window.conveyor.db.removeProject({ id });
    } catch {
      set({ projects, sessions, expandedProjectIds });
    }
  },

  createSession: async (projectId: string) => {
    const { sessions } = get();
    const session: Session = {
      id: crypto.randomUUID(),
      projectId,
      title: "New Session",
      createdAt: new Date().toISOString(),
    };

    set({ sessions: [...sessions, session] });

    const { success } = await window.conveyor.db.createSession(session);
    if (!success) {
      set({ sessions });
    }

    return session;
  },

  deleteSession: async (id: string) => {
    const { sessions } = get();
    set({ sessions: sessions.filter((s) => s.id !== id) });

    try {
      await window.conveyor.db.deleteSession({ id });
    } catch {
      set({ sessions });
    }
  },

  expandProject: (id: string) => {
    const { expandedProjectIds } = get();
    if (!expandedProjectIds.includes(id)) {
      set({ expandedProjectIds: [...expandedProjectIds, id] });
    }
  },

  toggleProjectExpanded: (id: string) => {
    const { expandedProjectIds } = get();
    if (expandedProjectIds.includes(id)) {
      set({ expandedProjectIds: expandedProjectIds.filter((eid) => eid !== id) });
    } else {
      set({ expandedProjectIds: [...expandedProjectIds, id] });
    }
  },

  getProjectSessions: (projectId: string) => {
    return get().sessions.filter((s) => s.projectId === projectId);
  },
}));
