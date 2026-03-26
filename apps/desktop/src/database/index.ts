// Types (heavy interface)
export type {
  SelectProject,
  InsertProject,
  SelectSession,
  InsertSession,
  SelectSetting,
  InsertSetting,
  SettingKey,
} from "./types";

// Lifecycle
export { initDatabase, closeDatabase } from "./connection";

// Queries — projects
export { getAllProjects, addProject, removeProject } from "./queries/projects";

// Queries — sessions
export {
  getAllSessions,
  getProjectSessions,
  createSession,
  deleteSession,
} from "./queries/sessions";

// Queries — settings
export { getSetting, setSetting } from "./queries/settings";
