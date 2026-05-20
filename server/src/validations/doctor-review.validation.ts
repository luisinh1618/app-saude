import { z } from "zod";

export const createDoctorReviewSchema = z.object({
  doctorId: z.uuid({
    message: "ID do médico inválido",
  }),

  appointmentId: z.uuid({
    message: "ID da consulta inválido",
  }),

  rating: z.number().int().min(1).max(5),

  comment: z.string().optional(),
});