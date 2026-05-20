import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export async function listUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users);
}

export async function toggleUserStatus(userId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  const user = result[0];

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const now = new Date().toISOString();

  await db
    .update(users)
    .set({
      isActive: !user.isActive,
      updatedAt: now,
    })
    .where(eq(users.id, userId));

  return {
    userId,
    isActive: !user.isActive,
  };
}