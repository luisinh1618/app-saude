import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { patients, users } from "../db/schema.js";

export async function getPatientProfileByUserId(userId: string) {
  const result = await db
    .select({
      patientId: patients.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      phone: patients.phone,
      birthDate: patients.birthDate,
      address: patients.address,
    })
    .from(patients)
    .innerJoin(users, eq(patients.userId, users.id))
    .where(eq(patients.userId, userId));

  const patient = result[0];

  if (!patient) {
    throw new Error("Paciente não encontrado");
  }

  return patient;
}

export async function updatePatientProfileByUserId(
  userId: string,
  data: {
    phone?: string;
    birthDate?: string;
    address?: string;
  }
) {
  await db
    .update(patients)
    .set({
      phone: data.phone,
      birthDate: data.birthDate,
      address: data.address,
    })
    .where(eq(patients.userId, userId));

  return getPatientProfileByUserId(userId);
}