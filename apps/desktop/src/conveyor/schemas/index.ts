import type { z } from "zod";
import { appSchemas } from "./app-schema";
import { windowSchemas } from "./window-schema";
import { webcontentSchemas } from "./webcontent-schema";

export const ipcSchemas = {
  ...appSchemas,
  ...windowSchemas,
  ...webcontentSchemas,
} as const;

// --- Type utilities ---

export type IPCChannels = typeof ipcSchemas;

export type ChannelName = keyof IPCChannels;

export type ChannelArgs<T extends ChannelName> = z.infer<IPCChannels[T]["args"]>;

export type ChannelReturn<T extends ChannelName> = z.infer<IPCChannels[T]["return"]>;

// --- Runtime validators ---

export function validateArgs<T extends ChannelName>(channel: T, args: unknown): ChannelArgs<T> {
  return ipcSchemas[channel].args.parse(args) as ChannelArgs<T>;
}

export function validateReturn<T extends ChannelName>(
  channel: T,
  value: unknown,
): ChannelReturn<T> {
  return ipcSchemas[channel].return.parse(value) as ChannelReturn<T>;
}
