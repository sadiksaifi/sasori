import { z } from "zod";

export const dialogSchemas = {
  "dialog:open-directory": {
    args: z.object({}),
    return: z.object({
      path: z.string().nullable(),
    }),
  },
  "dialog:confirm": {
    args: z.object({
      message: z.string(),
      detail: z.string().optional(),
      confirmLabel: z.string().optional(),
      cancelLabel: z.string().optional(),
    }),
    return: z.object({
      confirmed: z.boolean(),
    }),
  },
} as const;
