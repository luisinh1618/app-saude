import { z } from "zod";

export const createPrescriptionSchema = z.object({
  medicalRecordId: z.uuid({
    message: "ID do prontuário inválido",
  }),

  medication: z.string().min(2, {
    message: "Medicamento deve ter no mínimo 2 caracteres",
  }),

  dosage: z.string().min(1, {
    message: "Dosagem é obrigatória",
  }),

  instructions: z.string().optional(),
});