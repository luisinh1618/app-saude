import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { doctors, timeSlots } from "../db/schema.js";

type CreateTimeSlotData = {
  doctorUserId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export async function createTimeSlot(
  data: CreateTimeSlotData
) {
  const doctor = await findDoctorByUserId(
    data.doctorUserId
  );

  const id = randomUUID();
  const now = new Date().toISOString();

  await db.insert(timeSlots).values({
    id,
    doctorId: doctor.id,
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    endTime: data.endTime,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    doctorId: doctor.id,
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    endTime: data.endTime,
  };
}
export async function listDoctorTimeSlots(doctorId: string) {
  return db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.doctorId, doctorId));
}

export async function deleteTimeSlot(
  id: string,
  user: {
    id: string;
    role: "patient" | "doctor" | "admin";
  }
) {
  const slotResult = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, id));

  const slot = slotResult[0];

  if (!slot) {
    throw new Error("Horário não encontrado");
  }

  if (user.role === "doctor") {
    const doctor = await findDoctorByUserId(user.id);

    if (slot.doctorId !== doctor.id) {
      throw new Error("Você não tem permissão para remover este horário");
    }
  }

  await db.delete(timeSlots).where(eq(timeSlots.id, id));

  return {
    message: "Horário removido com sucesso",
  };
}
export async function findDoctorByUserId(userId: string) {
  const result = await db
    .select()
    .from(doctors)
    .where(eq(doctors.userId, userId));

  const doctor = result[0];

  if (!doctor) {
    throw new Error("Médico não encontrado para este usuário");
  }

  return doctor;
}