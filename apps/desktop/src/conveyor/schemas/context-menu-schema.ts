import { z } from "zod";

const menuItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  type: z.enum(["normal", "separator", "checkbox"]).optional(),
  enabled: z.boolean().optional(),
  checked: z.boolean().optional(),
});

export const contextMenuSchemas = {
  "context-menu:show": {
    args: z.object({
      items: z.array(menuItemSchema),
    }),
    return: z.object({
      actionId: z.string().nullable(),
    }),
  },
} as const;
