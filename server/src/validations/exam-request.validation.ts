import { z } from "zod";

export const createExamRequestSchema = z.object({
  medicalRecordId: z.uuid({
    message: "ID do prontuário inválido",
  }),

  examName: z.string().min(2, {
    message: "Nome do exame deve ter no mínimo 2 caracteres",
  }),

  reason: z.string().optional(),

  instructions: z.string().optional(),
});