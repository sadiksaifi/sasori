import type { ChannelReturn } from "../schemas";
import { ConveyorApi } from "./base";

export class DialogApi extends ConveyorApi {
  openDirectory(): Promise<ChannelReturn<"dialog:open-directory">> {
    return this.invoke("dialog:open-directory");
  }
}
