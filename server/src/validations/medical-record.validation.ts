import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  appointmentId: z.uuid({
    message: "ID da consulta inválido",
  }),

  diagnosis: z.string().min(3, {
    message: "Diagnóstico deve ter no mínimo 3 caracteres",
  }),

  treatment: z.string().optional(),

  notes: z.string().optional(),
});