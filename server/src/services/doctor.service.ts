import { db } from "../db/index.js";
import { doctors, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// 🔎 Buscar médico pelo userId
export async function findDoctorByUserId(userId: string) {
  const result = await db
    .select({
      id: doctors.id,
      doctorId: doctors.id,
      userId: doctors.userId,
      name: users.name,
      email: users.email,
      crm: doctors.crm,
      phone: doctors.phone,
      specialty: doctors.specialty,
      biography: doctors.biography,
      approvalStatus: doctors.approvalStatus,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.userId, userId));

  return result[0];
}

// 📋 Listar todos os médicos
export async function listDoctors() {
  return await db
    .select({
      id: doctors.id,
      doctorId: doctors.id,
      userId: doctors.userId,
      name: users.name,
      email: users.email,
      crm: doctors.crm,
      phone: doctors.phone,
      specialty: doctors.specialty,
      biography: doctors.biography,
      approvalStatus: doctors.approvalStatus,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id));
}

// ✅ Listar médicos aprovados
export async function listApprovedDoctors() {
  return await db
    .select({
      id: doctors.id,
      doctorId: doctors.id,
      userId: doctors.userId,
      name: users.name,
      email: users.email,
      crm: doctors.crm,
      phone: doctors.phone,
      specialty: doctors.specialty,
      biography: doctors.biography,
      approvalStatus: doctors.approvalStatus,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.approvalStatus, "approved"));
}

// 🔎 Médicos por especialidade
export async function listApprovedDoctorsBySpecialty(
  specialty: string
) {
  return await db
    .select({
      id: doctors.id,
      doctorId: doctors.id,
      userId: doctors.userId,
      name: users.name,
      email: users.email,
      crm: doctors.crm,
      phone: doctors.phone,
      specialty: doctors.specialty,
      biography: doctors.biography,
      approvalStatus: doctors.approvalStatus,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.specialty, specialty));
}

// 🟡 Listar médicos pendentes
export async function listPendingDoctors() {
  return await db
    .select({
      id: doctors.id,
      doctorId: doctors.id,
      userId: doctors.userId,
      name: users.name,
      email: users.email,
      crm: doctors.crm,
      phone: doctors.phone,
      specialty: doctors.specialty,
      biography: doctors.biography,
      approvalStatus: doctors.approvalStatus,
    })
    .from(doctors)
    .innerJoin(users, eq(doctors.userId, users.id))
    .where(eq(doctors.approvalStatus, "pending"));
}

// ✅ Aprovar médico
export async function approveDoctor(doctorId: string) {
  const result = await db
    .update(doctors)
    .set({
      approvalStatus: "approved",
    })
    .where(eq(doctors.id, doctorId))
    .returning();

  if (!result[0]) {
    throw new Error("Médico não encontrado");
  }

  return result[0];
}

// ❌ Rejeitar médico
export async function rejectDoctor(doctorId: string) {
  const result = await db
    .update(doctors)
    .set({
      approvalStatus: "rejected",
    })
    .where(eq(doctors.id, doctorId))
    .returning();

  if (!result[0]) {
    throw new Error("Médico não encontrado");
  }

  return result[0];
}

// ➕ Adicionar ou atualizar especialidade
export async function addSpecialtyToDoctor(
  doctorId: string,
  specialty: string
) {
  const result = await db
    .update(doctors)
    .set({
      specialty,
    })
    .where(eq(doctors.id, doctorId))
    .returning();

  if (!result[0]) {
    throw new Error("Médico não encontrado");
  }

  return result[0];
}

// 📋 Listar especialidade do médico
export async function listDoctorSpecialties(doctorId: string) {
  const result = await db
    .select({
      specialty: doctors.specialty,
    })
    .from(doctors)
    .where(eq(doctors.id, doctorId));

  return result[0]?.specialty || null;
}