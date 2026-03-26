import { ipcMain } from "electron";
import type { ChannelName, ChannelArgs, ChannelReturn } from "../conveyor/schemas";
import { validateArgs, validateReturn } from "../conveyor/schemas";

export function handle<T extends ChannelName>(
  channel: T,
  handler: (args: ChannelArgs<T>) => Promise<ChannelReturn<T>> | ChannelReturn<T>,
): void {
  ipcMain.handle(channel, async (_event, args) => {
    const validArgs = validateArgs(channel, args ?? {});
    const result = await handler(validArgs);
    return validateReturn(channel, result);
  });
}
