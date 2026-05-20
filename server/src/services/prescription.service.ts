import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import {
  doctors,
  patients,
  medicalRecords,
  prescriptions,
} from "../db/schema.js";

export async function createPrescription(
  doctorUserId: string,
  data: {
    medicalRecordId: string;
    medication: string;
    dosage: string;
    instructions?: string;
  }
) {
  const doctorResult = await db
    .select()
    .from(doctors)
    .where(eq(doctors.userId, doctorUserId));

  const doctor = doctorResult[0];

  if (!doctor) {
    throw new Error("Médico não encontrado");
  }

  const recordResult = await db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.id, data.medicalRecordId));

  const record = recordResult[0];

  if (!record) {
    throw new Error("Prontuário não encontrado");
  }

  const prescription = {
    id: randomUUID(),
    medicalRecordId: data.medicalRecordId,
    patientId: record.patientId,
    doctorId: doctor.id,
    medication: data.medication,
    dosage: data.dosage,
    instructions: data.instructions,
    createdAt: new Date().toISOString(),
  };

  await db.insert(prescriptions).values(prescription);

  return prescription;
}

export async function listPatientPrescriptions(patientUserId: string) {
  const patientResult = await db
    .select()
    .from(patients)
    .where(eq(patients.userId, patientUserId));

  const patient = patientResult[0];

  if (!patient) {
    throw new Error("Paciente não encontrado");
  }

  return await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.patientId, patient.id));
}

export async function listDoctorPrescriptions(doctorUserId: string) {
  const doctorResult = await db
    .select()
    .from(doctors)
    .where(eq(doctors.userId, doctorUserId));

  const doctor = doctorResult[0];

  if (!doctor) {
    throw new Error("Médico não encontrado");
  }

  return await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.doctorId, doctor.id));
}