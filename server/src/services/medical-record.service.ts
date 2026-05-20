import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";

import {
  appointments,
  doctors,
  medicalRecords,
  patients,
} from "../db/schema.js";

type CreateMedicalRecordData = {
  appointmentId: string;
  doctorUserId: string;
  diagnosis: string;
  treatment?: string;
  notes?: string;
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

export async function createMedicalRecord(data: CreateMedicalRecordData) {
  const doctor = await findDoctorByUserId(data.doctorUserId);

  const appointmentResult = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.id, data.appointmentId),
        eq(appointments.doctorId, doctor.id)
      )
    );

  const appointment = appointmentResult[0];

  if (!appointment) {
    throw new Error("Consulta não encontrada para este médico");
  }

  const patientResult = await db
    .select()
    .from(patients)
    .where(eq(patients.id, appointment.patientId));

  if (patientResult.length === 0) {
    throw new Error("Paciente não encontrado");
  }

  const now = new Date().toISOString();
  const id = randomUUID();

  await db.insert(medicalRecords).values({
    id,
    appointmentId: appointment.id,
    patientId: appointment.patientId,
    doctorId: doctor.id,
    diagnosis: data.diagnosis,
    treatment: data.treatment,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    appointmentId: appointment.id,
    patientId: appointment.patientId,
    doctorId: doctor.id,
    diagnosis: data.diagnosis,
    treatment: data.treatment,
    notes: data.notes,
  };
}

export async function listMedicalRecordsByPatient(patientId: string) {
  return db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.patientId, patientId));
}

export async function listMedicalRecordsByDoctor(doctorId: string) {
  return db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.doctorId, doctorId));
}