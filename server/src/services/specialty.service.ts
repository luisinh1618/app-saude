import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { specialties } from "../db/schema.js";

type CreateSpecialtyData = {
  name: string;
  description?: string | undefined;
};

type UpdateSpecialtyData = {
  name?: string | undefined;
  description?: string | undefined;
};

export async function createSpecialty(data: CreateSpecialtyData) {
  const now = new Date().toISOString();

  const existing = await db
    .select()
    .from(specialties)
    .where(eq(specialties.name, data.name));

  if (existing.length > 0) {
    throw new Error("Especialidade já cadastrada");
  }

  const id = randomUUID();

  await db.insert(specialties).values({
    id,
    name: data.name,
    description: data.description,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    name: data.name,
    description: data.description,
    isActive: true,
  };
}

export async function listSpecialties() {
  return db.select().from(specialties);
}

export async function updateSpecialty(
  id: string,
  data: UpdateSpecialtyData
) {
  const now = new Date().toISOString();

  await db
    .update(specialties)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(specialties.id, id));

  return {
    id,
    ...data,
  };
}

export async function deleteSpecialty(id: string) {
  await db.delete(specialties).where(eq(specialties.id, id));

  return {
    message: "Especialidade removida com sucesso",
  };
}