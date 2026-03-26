import { z } from "zod";

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  createdAt: z.string(),
});

const sessionSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  createdAt: z.string(),
});

export const dbSchemas = {
  "db:get-all-projects": {
    args: z.object({}),
    return: z.array(projectSchema),
  },
  "db:add-project": {
    args: projectSchema,
    return: z.object({ success: z.boolean() }),
  },
  "db:remove-project": {
    args: z.object({ id: z.string() }),
    return: z.void(),
  },
  "db:get-all-sessions": {
    args: z.object({}),
    return: z.array(sessionSchema),
  },
  "db:get-project-sessions": {
    args: z.object({ projectId: z.string() }),
    return: z.array(sessionSchema),
  },
  "db:create-session": {
    args: sessionSchema,
    return: z.object({ success: z.boolean() }),
  },
  "db:delete-session": {
    args: z.object({ id: z.string() }),
    return: z.void(),
  },
  "db:get-setting": {
    args: z.object({ key: z.string() }),
    return: z.string().nullable(),
  },
  "db:set-setting": {
    args: z.object({ key: z.string(), value: z.string() }),
    return: z.void(),
  },
} as const;
