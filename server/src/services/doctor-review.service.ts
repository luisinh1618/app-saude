import { randomUUID } from "crypto";
import { and, avg, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { appointments, doctorReviews, patients } from "../db/schema.js";

type CreateDoctorReviewData = {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
};

export async function createDoctorReview(data: CreateDoctorReviewData) {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("A avaliação deve ser entre 1 e 5");
  }

 const [appointment] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, data.appointmentId));

  // 1. Verificamos se a consulta existe
  if (!appointment) {
    throw new Error("Consulta não encontrada");
  }

  // 2. Agora o TS sabe que 'appointment' existe e não é um array
  if (appointment.status !== "completed") {
    throw new Error("Só é possível avaliar consultas finalizadas");
  }

  const alreadyReviewed = await db
    .select()
    .from(doctorReviews)
    .where(eq(doctorReviews.appointmentId, data.appointmentId));

  if (alreadyReviewed.length > 0) {
    throw new Error("Esta consulta já foi avaliada");
  }

  const id = randomUUID();

  await db.insert(doctorReviews).values({
    id,
    patientId: data.patientId,
    doctorId: data.doctorId,
    appointmentId: data.appointmentId,
    rating: data.rating,
    comment: data.comment,
    createdAt: new Date().toISOString(),
  });

  return {
    id,
    ...data,
  };
}

export async function listDoctorReviews(doctorId: string) {
  return db
    .select()
    .from(doctorReviews)
    .where(eq(doctorReviews.doctorId, doctorId));
}

export async function getDoctorAverageRating(doctorId: string) {
  const result = await db
    .select({
      averageRating: avg(doctorReviews.rating),
    })
    .from(doctorReviews)
    .where(eq(doctorReviews.doctorId, doctorId));

  return {
    doctorId,
    averageRating: result[0]?.averageRating ?? 0,
  };
}
export async function findPatientByUserId(userId: string) {
  const result = await db
    .select()
    .from(patients)
    .where(eq(patients.userId, userId));

  const patient = result[0];

  if (!patient) {
    throw new Error("Paciente não encontrado para este usuário");
  }

  return patient;
}