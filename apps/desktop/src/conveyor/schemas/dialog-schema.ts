import { z } from "zod";

export const dialogSchemas = {
  "dialog:open-directory": {
    args: z.object({}),
    return: z.object({
      path: z.string().nullable(),
    }),
  },
} as const;
