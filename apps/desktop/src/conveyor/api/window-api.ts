import type { ChannelReturn } from "../schemas";
import { ConveyorApi } from "./base";

export class WindowApi extends ConveyorApi {
  init(): Promise<ChannelReturn<"window:init">> {
    return this.invoke("window:init");
  }

  minimize(): Promise<void> {
    return this.invoke("window:minimize");
  }

  maximize(): Promise<void> {
    return this.invoke("window:maximize");
  }

  maximizeToggle(): Promise<void> {
    return this.invoke("window:maximize-toggle");
  }

  close(): Promise<void> {
    return this.invoke("window:close");
  }

  isMaximized(): Promise<boolean> {
    return this.invoke("window:is-maximized");
  }

  isFullscreen(): Promise<boolean> {
    return this.invoke("window:is-fullscreen");
  }

  toggleFullscreen(): Promise<void> {
    return this.invoke("window:toggle-fullscreen");
  }
}
