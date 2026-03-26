import type { ChannelArgs, ChannelReturn } from "../schemas";
import { ConveyorApi } from "./base";

export class ContextMenuApi extends ConveyorApi {
  show(args: ChannelArgs<"context-menu:show">): Promise<ChannelReturn<"context-menu:show">> {
    return this.invoke("context-menu:show", args);
  }
}
