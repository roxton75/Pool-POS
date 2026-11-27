import { asc, inArray } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzle } from "../database";
import { resources, sessions } from "../database/schema";

export function useLiveBookingResources() {
  const db = useDrizzle();
  return useLiveQuery(db.select().from(resources).orderBy(asc(resources.displayOrder)));
}

export function useLiveActiveSessions() {
  const db = useDrizzle();
  return useLiveQuery(
    db.select().from(sessions)
      .where(inArray(sessions.status, ["active", "paused"]))
      .orderBy(asc(sessions.startedAt)),
  );
}
