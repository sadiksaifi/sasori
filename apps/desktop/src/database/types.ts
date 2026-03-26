import type { projects, sessions, settings } from "./schema";

// --- Project ---

export type SelectProject = typeof projects.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;

// --- Session ---

export type SelectSession = typeof sessions.$inferSelect;

export type InsertSession = typeof sessions.$inferInsert;

// --- Settings ---

export type SelectSetting = typeof settings.$inferSelect;

export type InsertSetting = typeof settings.$inferInsert;

export type SettingKey = "last_active_project_id" | "last_active_session_id";
