import type { ChannelArgs, ChannelReturn } from "../schemas";
import { ConveyorApi } from "./base";

export class DialogApi extends ConveyorApi {
  openDirectory(): Promise<ChannelReturn<"dialog:open-directory">> {
    return this.invoke("dialog:open-directory");
  }

  confirm(args: ChannelArgs<"dialog:confirm">): Promise<ChannelReturn<"dialog:confirm">> {
    return this.invoke("dialog:confirm", args);
  }
}
