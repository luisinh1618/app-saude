import { z } from "zod";

export const createAppointmentSchema = z.object({
  doctorId: z.uuid({
    message: "ID do médico inválido",
  }),

  appointmentDate: z.string().min(1, {
    message: "Data da consulta é obrigatória",
  }),

  appointmentTime: z.string().min(1, {
    message: "Horário da consulta é obrigatório",
  }),

  notes: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "cancelled",
    "completed",
  ]),
});