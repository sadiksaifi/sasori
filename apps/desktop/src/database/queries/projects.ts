import { eq } from "drizzle-orm";
import { getDb } from "../connection";
import { projects } from "../schema";
import type { InsertProject, SelectProject } from "../types";

export function getAllProjects(): SelectProject[] {
  return getDb().select().from(projects).all();
}

export function addProject(project: InsertProject): { success: boolean } {
  try {
    getDb().insert(projects).values(project).run();
    return { success: true };
  } catch {
    return { success: false };
  }
}

export function removeProject(id: string): void {
  getDb().delete(projects).where(eq(projects.id, id)).run();
}
