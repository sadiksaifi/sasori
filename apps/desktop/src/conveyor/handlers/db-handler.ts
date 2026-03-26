import { handle } from "../../main/shared";
import {
  getAllProjects,
  addProject,
  updateProject,
  removeProject,
  getAllSessions,
  getProjectSessions,
  createSession,
  updateSession,
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

  handle("db:update-session", ({ id, data }) => {
    updateSession(id, data);
  });

  handle("db:delete-session", ({ id }) => {
    deleteSession(id);
  });

  handle("db:update-project", ({ id, data }) => {
    updateProject(id, data);
  });

  handle("db:get-setting", ({ key }) => getSetting(key));

  handle("db:set-setting", ({ key, value }) => {
    setSetting(key, value);
  });
}
