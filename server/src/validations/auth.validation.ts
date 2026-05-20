import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter no mínimo 3 caracteres",
  }),

  email: z.email({
    message: "Email inválido",
  }),

  password: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),

  role: z.enum(["patient", "doctor", "admin"]),

  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),

  crm: z.string().optional(),
  specialty: z.string().optional(),
  biography: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email({
    message: "Email inválido",
  }),

  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
});