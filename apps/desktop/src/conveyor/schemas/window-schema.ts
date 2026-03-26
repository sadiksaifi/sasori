import { z } from "zod";

export const windowSchemas = {
  "window:init": {
    args: z.object({}),
    return: z.object({
      width: z.number(),
      height: z.number(),
      minimizable: z.boolean(),
      maximizable: z.boolean(),
      closable: z.boolean(),
      fullscreenable: z.boolean(),
      platform: z.string(),
    }),
  },
  "window:minimize": {
    args: z.object({}),
    return: z.void(),
  },
  "window:maximize": {
    args: z.object({}),
    return: z.void(),
  },
  "window:maximize-toggle": {
    args: z.object({}),
    return: z.void(),
  },
  "window:close": {
    args: z.object({}),
    return: z.void(),
  },
  "window:is-maximized": {
    args: z.object({}),
    return: z.boolean(),
  },
  "window:is-fullscreen": {
    args: z.object({}),
    return: z.boolean(),
  },
  "window:toggle-fullscreen": {
    args: z.object({}),
    return: z.void(),
  },
} as const;
