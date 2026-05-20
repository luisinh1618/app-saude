import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { doctors, users } from "../db/schema.js";

export async function getDoctorProfileByUserId(userId: string) {
  const result = await db
    .select({
      doctorId: doctors.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      crm: doctors.crm,
      phone: doctors.phone,
      biography: doctors.biography,
      approvalStatus: doctors.approvalStatus,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.userId, userId));

  const doctor = result[0];

  if (!doctor) {
    throw new Error("Médico não encontrado");
  }

  return doctor;
}

export async function updateDoctorProfileByUserId(
  userId: string,
  data: {
    phone?: string;
    biography?: string;
  }
) {
  await db
    .update(doctors)
    .set({
      phone: data.phone,
      biography: data.biography,
    })
    .where(eq(doctors.userId, userId));

  return getDoctorProfileByUserId(userId);
}