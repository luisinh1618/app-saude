import { z } from "zod";

export const createTimeSlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),

  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Horário inicial deve estar no formato HH:mm",
  }),

  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Horário final deve estar no formato HH:mm",
  }),
});