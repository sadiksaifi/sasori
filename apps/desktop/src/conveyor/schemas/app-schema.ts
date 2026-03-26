import { z } from "zod";

export const appSchemas = {
  "app:version": {
    args: z.object({}),
    return: z.string(),
  },
} as const;
