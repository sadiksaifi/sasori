import { ConveyorApi } from "./base";

export class WebContentApi extends ConveyorApi {
  undo(): Promise<void> {
    return this.invoke("webcontent:undo");
  }

  redo(): Promise<void> {
    return this.invoke("webcontent:redo");
  }

  cut(): Promise<void> {
    return this.invoke("webcontent:cut");
  }

  copy(): Promise<void> {
    return this.invoke("webcontent:copy");
  }

  paste(): Promise<void> {
    return this.invoke("webcontent:paste");
  }

  selectAll(): Promise<void> {
    return this.invoke("webcontent:select-all");
  }

  reload(): Promise<void> {
    return this.invoke("webcontent:reload");
  }

  forceReload(): Promise<void> {
    return this.invoke("webcontent:force-reload");
  }

  toggleDevtools(): Promise<void> {
    return this.invoke("webcontent:toggle-devtools");
  }

  zoomIn(): Promise<void> {
    return this.invoke("webcontent:zoom-in");
  }

  zoomOut(): Promise<void> {
    return this.invoke("webcontent:zoom-out");
  }

  zoomReset(): Promise<void> {
    return this.invoke("webcontent:zoom-reset");
  }

  openUrl(args: { url: string }): Promise<void> {
    return this.invoke("webcontent:open-url", args);
  }
}
