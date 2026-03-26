import { handle } from "../../main/shared";
import {
  getAllProjects,
  addProject,
  removeProject,
  getAllSessions,
  getProjectSessions,
  createSession,
  deleteSession,
  getSetting,
  setSetting,
} from "../../database";

export function registerDbHandlers(): void {
  handle("db:get-all-projects", () => getAllProjects());

  handle("db:add-project", (project) => addProject(project));

  handle("db:remove-project", ({ id }) => {
    removeProject(id);
  });

  handle("db:get-all-sessions", () => getAllSessions());

  handle("db:get-project-sessions", ({ projectId }) => getProjectSessions(projectId));

  handle("db:create-session", (session) => createSession(session));

  handle("db:delete-session", ({ id }) => {
    deleteSession(id);
  });

  handle("db:get-setting", ({ key }) => getSetting(key));

  handle("db:set-setting", ({ key, value }) => {
    setSetting(key, value);
  });
}
