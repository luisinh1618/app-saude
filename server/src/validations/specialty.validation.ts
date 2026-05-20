import { z } from "zod";

export const createSpecialtySchema = z.object({
  name: z.string().min(2, {
    message: "Nome da especialidade deve ter no mínimo 2 caracteres",
  }),

  description: z.string().optional(),
});

export const updateSpecialtySchema = z.object({
  name: z.string().min(2, {
    message: "Nome da especialidade deve ter no mínimo 2 caracteres",
  }).optional(),

  description: z.string().optional(),
});