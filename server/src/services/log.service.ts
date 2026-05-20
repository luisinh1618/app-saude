/*import { randomUUID } from "crypto";

import { db } from "../db/index.js";
import { systemLogs } from "../db/schema.js";

export async function createSystemLog(data: {
  userId?: string;
  action: string;
  description: string;
}) {
  await db.insert(systemLogs).values({
    id: randomUUID(),
    userId: data.userId,
    action: data.action,
    description: data.description,
    createdAt: new Date().toISOString(),
  });

  return true;
}

export async function listSystemLogs() {
  return db.select().from(systemLogs);
}*/