import { eq } from "drizzle-orm";
import { getDb } from "../connection";
import { sessions } from "../schema";
import type { InsertSession, SelectSession } from "../types";

export function getAllSessions(): SelectSession[] {
  return getDb().select().from(sessions).all();
}

export function getProjectSessions(projectId: string): SelectSession[] {
  return getDb().select().from(sessions).where(eq(sessions.projectId, projectId)).all();
}

export function createSession(session: InsertSession): { success: boolean } {
  try {
    getDb().insert(sessions).values(session).run();
    return { success: true };
  } catch {
    return { success: false };
  }
}

export function deleteSession(id: string): void {
  getDb().delete(sessions).where(eq(sessions.id, id)).run();
}
