import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  path: string;
  pinnedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
}

export interface Session {
  id: string;
  projectId: string;
  title: string;
  pinnedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
}

export type SidebarFilter = "active" | "archived" | "all";

interface ProjectState {
  projects: Project[];
  sessions: Session[];
  expandedProjectIds: string[];
  renamingItemId: string | null;
  sidebarFilter: SidebarFilter;
  _hydrated: boolean;

  hydrate: () => Promise<void>;
  addProject: (path: string) => Promise<Project | null>;
  removeProject: (id: string) => Promise<void>;
  renameProject: (id: string, name: string) => Promise<void>;
  pinProject: (id: string) => Promise<void>;
  unpinProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  unarchiveProject: (id: string) => Promise<void>;
  createSession: (projectId: string) => Promise<Session>;
  deleteSession: (id: string) => Promise<void>;
  renameSession: (id: string, title: string) => Promise<void>;
  pinSession: (id: string) => Promise<void>;
  unpinSession: (id: string) => Promise<void>;
  archiveSession: (id: string) => Promise<void>;
  unarchiveSession: (id: string) => Promise<void>;
  expandProject: (id: string) => void;
  toggleProjectExpanded: (id: string) => void;
  getProjectSessions: (projectId: string) => Session[];
  setRenamingItemId: (id: string | null) => void;
  setSidebarFilter: (filter: SidebarFilter) => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  sessions: [],
  expandedProjectIds: [],
  renamingItemId: null,
  sidebarFilter: "active",
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
      pinnedAt: null,
      archivedAt: null,
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

  renameProject: async (id: string, name: string) => {
    const { projects } = get();
    set({ projects: projects.map((p) => (p.id === id ? { ...p, name } : p)) });
    try {
      await window.conveyor.db.updateProject({ id, data: { name } });
    } catch {
      set({ projects });
    }
  },

  pinProject: async (id: string) => {
    const { projects } = get();
    const pinnedAt = new Date().toISOString();
    set({ projects: projects.map((p) => (p.id === id ? { ...p, pinnedAt } : p)) });
    try {
      await window.conveyor.db.updateProject({ id, data: { pinnedAt } });
    } catch {
      set({ projects });
    }
  },

  unpinProject: async (id: string) => {
    const { projects } = get();
    set({ projects: projects.map((p) => (p.id === id ? { ...p, pinnedAt: null } : p)) });
    try {
      await window.conveyor.db.updateProject({ id, data: { pinnedAt: null } });
    } catch {
      set({ projects });
    }
  },

  archiveProject: async (id: string) => {
    const { projects } = get();
    const archivedAt = new Date().toISOString();
    set({ projects: projects.map((p) => (p.id === id ? { ...p, archivedAt } : p)) });
    try {
      await window.conveyor.db.updateProject({ id, data: { archivedAt } });
    } catch {
      set({ projects });
    }
  },

  unarchiveProject: async (id: string) => {
    const { projects } = get();
    set({ projects: projects.map((p) => (p.id === id ? { ...p, archivedAt: null } : p)) });
    try {
      await window.conveyor.db.updateProject({ id, data: { archivedAt: null } });
    } catch {
      set({ projects });
    }
  },

  createSession: async (projectId: string) => {
    const { sessions } = get();
    const session: Session = {
      id: crypto.randomUUID(),
      projectId,
      title: "New Session",
      pinnedAt: null,
      archivedAt: null,
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

  renameSession: async (id: string, title: string) => {
    const { sessions } = get();
    set({ sessions: sessions.map((s) => (s.id === id ? { ...s, title } : s)) });
    try {
      await window.conveyor.db.updateSession({ id, data: { title } });
    } catch {
      set({ sessions });
    }
  },

  pinSession: async (id: string) => {
    const { sessions } = get();
    const pinnedAt = new Date().toISOString();
    set({ sessions: sessions.map((s) => (s.id === id ? { ...s, pinnedAt } : s)) });
    try {
      await window.conveyor.db.updateSession({ id, data: { pinnedAt } });
    } catch {
      set({ sessions });
    }
  },

  unpinSession: async (id: string) => {
    const { sessions } = get();
    set({ sessions: sessions.map((s) => (s.id === id ? { ...s, pinnedAt: null } : s)) });
    try {
      await window.conveyor.db.updateSession({ id, data: { pinnedAt: null } });
    } catch {
      set({ sessions });
    }
  },

  archiveSession: async (id: string) => {
    const { sessions } = get();
    const archivedAt = new Date().toISOString();
    set({ sessions: sessions.map((s) => (s.id === id ? { ...s, archivedAt } : s)) });
    try {
      await window.conveyor.db.updateSession({ id, data: { archivedAt } });
    } catch {
      set({ sessions });
    }
  },

  unarchiveSession: async (id: string) => {
    const { sessions } = get();
    set({ sessions: sessions.map((s) => (s.id === id ? { ...s, archivedAt: null } : s)) });
    try {
      await window.conveyor.db.updateSession({ id, data: { archivedAt: null } });
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

  setRenamingItemId: (id: string | null) => {
    set({ renamingItemId: id });
  },

  setSidebarFilter: (filter: SidebarFilter) => {
    set({ sidebarFilter: filter });
  },
}));
