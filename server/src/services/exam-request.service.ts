import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";

import {
  doctors,
  examRequests,
  medicalRecords,
  patients,
} from "../db/schema.js";

type CreateExamRequestData = {
  medicalRecordId: string;
  doctorUserId: string;
  examName: string;
  reason?: string;
  instructions?: string;
};

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

export async function createExamRequest(data: CreateExamRequestData) {
  const doctor = await findDoctorByUserId(data.doctorUserId);

  const recordResult = await db
    .select()
    .from(medicalRecords)
    .where(
      and(
        eq(medicalRecords.id, data.medicalRecordId),
        eq(medicalRecords.doctorId, doctor.id)
      )
    );

  const record = recordResult[0];

  if (!record) {
    throw new Error("Prontuário não encontrado para este médico");
  }

  const id = randomUUID();

  await db.insert(examRequests).values({
    id,
    medicalRecordId: record.id,
    patientId: record.patientId,
    doctorId: doctor.id,
    examName: data.examName,
    reason: data.reason,
    instructions: data.instructions,
    createdAt: new Date().toISOString(),
  });

  return {
    id,
    medicalRecordId: record.id,
    patientId: record.patientId,
    doctorId: doctor.id,
    examName: data.examName,
    reason: data.reason,
    instructions: data.instructions,
  };
}

export async function listExamRequestsByPatient(patientId: string) {
  return db
    .select()
    .from(examRequests)
    .where(eq(examRequests.patientId, patientId));
}

export async function listExamRequestsByDoctor(doctorId: string) {
  return db
    .select()
    .from(examRequests)
    .where(eq(examRequests.doctorId, doctorId));
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