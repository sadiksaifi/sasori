import { z } from "zod";

export const webcontentSchemas = {
  "webcontent:undo": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:redo": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:cut": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:copy": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:paste": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:select-all": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:reload": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:force-reload": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:toggle-devtools": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:zoom-in": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:zoom-out": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:zoom-reset": {
    args: z.object({}),
    return: z.void(),
  },
  "webcontent:open-url": {
    args: z.object({ url: z.string().url() }),
    return: z.void(),
  },
} as const;
