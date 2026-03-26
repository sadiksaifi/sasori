import type { ChannelArgs, ChannelReturn } from "../schemas";
import { ConveyorApi } from "./base";

export class DbApi extends ConveyorApi {
  getAllProjects(): Promise<ChannelReturn<"db:get-all-projects">> {
    return this.invoke("db:get-all-projects");
  }

  addProject(args: ChannelArgs<"db:add-project">): Promise<ChannelReturn<"db:add-project">> {
    return this.invoke("db:add-project", args);
  }

  removeProject(
    args: ChannelArgs<"db:remove-project">,
  ): Promise<ChannelReturn<"db:remove-project">> {
    return this.invoke("db:remove-project", args);
  }

  getAllSessions(): Promise<ChannelReturn<"db:get-all-sessions">> {
    return this.invoke("db:get-all-sessions");
  }

  getProjectSessions(
    args: ChannelArgs<"db:get-project-sessions">,
  ): Promise<ChannelReturn<"db:get-project-sessions">> {
    return this.invoke("db:get-project-sessions", args);
  }

  createSession(
    args: ChannelArgs<"db:create-session">,
  ): Promise<ChannelReturn<"db:create-session">> {
    return this.invoke("db:create-session", args);
  }

  deleteSession(
    args: ChannelArgs<"db:delete-session">,
  ): Promise<ChannelReturn<"db:delete-session">> {
    return this.invoke("db:delete-session", args);
  }

  getSetting(args: ChannelArgs<"db:get-setting">): Promise<ChannelReturn<"db:get-setting">> {
    return this.invoke("db:get-setting", args);
  }

  setSetting(args: ChannelArgs<"db:set-setting">): Promise<ChannelReturn<"db:set-setting">> {
    return this.invoke("db:set-setting", args);
  }
}
