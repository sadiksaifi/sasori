import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  addProject: (path: string) => Project | null;
  removeProject: (id: string) => void;
  createSession: (projectId: string) => Session;
  deleteSession: (id: string) => void;
  expandProject: (id: string) => void;
  toggleProjectExpanded: (id: string) => void;
  getProjectSessions: (projectId: string) => Session[];
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      sessions: [],
      expandedProjectIds: [],

      addProject: (path: string) => {
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
        return project;
      },

      removeProject: (id: string) => {
        const { projects, sessions, expandedProjectIds } = get();
        set({
          projects: projects.filter((p) => p.id !== id),
          sessions: sessions.filter((s) => s.projectId !== id),
          expandedProjectIds: expandedProjectIds.filter((eid) => eid !== id),
        });
      },

      createSession: (projectId: string) => {
        const { sessions } = get();
        const session: Session = {
          id: crypto.randomUUID(),
          projectId,
          title: "New Session",
          createdAt: new Date().toISOString(),
        };
        set({ sessions: [...sessions, session] });
        return session;
      },

      deleteSession: (id: string) => {
        const { sessions } = get();
        set({ sessions: sessions.filter((s) => s.id !== id) });
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
    }),
    { name: "sasori-projects" },
  ),
);
