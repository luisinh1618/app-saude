import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { appointments, doctors, patients, timeSlots } from "../db/schema.js";


type CreateAppointmentData = {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string | undefined;
};

export async function createAppointment(data: CreateAppointmentData) {
  const doctorExists = await db
    .select()
    .from(doctors)
    .where(eq(doctors.id, data.doctorId));

  if (doctorExists.length === 0) {
    throw new Error("Médico não encontrado");
  }

  const patientExists = await db
    .select()
    .from(patients)
    .where(eq(patients.id, data.patientId));

  if (patientExists.length === 0) {
    throw new Error("Paciente não encontrado");
  }

  const dayOfWeek = getDayOfWeek(data.appointmentDate);

  const availableSlots = await db
    .select()
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.doctorId, data.doctorId),
        eq(timeSlots.dayOfWeek, dayOfWeek),
        eq(timeSlots.isAvailable, true)
      )
    );

  const hasAvailableSlot = availableSlots.some((slot) =>
    isTimeInsideRange(data.appointmentTime, slot.startTime, slot.endTime)
  );

  if (!hasAvailableSlot) {
    throw new Error("Médico não atende neste dia ou horário");
  }

  const conflict = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, data.doctorId),
        eq(appointments.appointmentDate, data.appointmentDate),
        eq(appointments.appointmentTime, data.appointmentTime)
      )
    );

  if (conflict.length > 0) {
    throw new Error("Horário já ocupado para este médico");
  }

  const now = new Date().toISOString();
  const id = randomUUID();

  await db.insert(appointments).values({
    id,
    patientId: data.patientId,
    doctorId: data.doctorId,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    status: "pending",
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    ...data,
    status: "pending",
  };
}

export async function listAppointments() {
  return db.select().from(appointments);
}

export async function listAppointmentsByPatient(patientId: string) {
  return db
    .select()
    .from(appointments)
    .where(eq(appointments.patientId, patientId));
}

export async function listAppointmentsByDoctor(doctorId: string) {
  return db
    .select()
    .from(appointments)
    .where(eq(appointments.doctorId, doctorId));
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed",
  user: {
    id: string;
    role: "patient" | "doctor" | "admin";
  }
) {
  const appointmentResult = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId));

  const appointment = appointmentResult[0];

  if (!appointment) {
    throw new Error("Consulta não encontrada");
  }

  if (user.role === "doctor") {
    const doctor = await findDoctorByUserId(user.id);

    if (appointment.doctorId !== doctor.id) {
      throw new Error("Você não tem permissão para alterar esta consulta");
    }
  }

  const now = new Date().toISOString();

  await db
    .update(appointments)
    .set({
      status,
      updatedAt: now,
    })
    .where(eq(appointments.id, appointmentId));

  return {
    appointmentId,
    status,
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
function getDayOfWeek(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  return parsedDate.getDay();
}

function isTimeInsideRange(time: string, startTime: string, endTime: string) {
  return time >= startTime && time < endTime;
}