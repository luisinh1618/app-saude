import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import {
  createTimeSlot,
  deleteTimeSlot,
  listDoctorTimeSlots,
} from "../services/time-slot.service.js";

import { createTimeSlotSchema } from "../validations/time-slot.validation.js";

export async function create(
  req: AuthRequest,
  res: Response
) {
  try {
    const doctorUserId = req.user?.id;

    if (!doctorUserId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const data = createTimeSlotSchema.parse(req.body);

    if (data.startTime >= data.endTime) {
      return res.status(400).json({
        message:
          "Horário inicial deve ser menor que o horário final",
      });
    }

    const slot = await createTimeSlot({
      doctorUserId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    return res.status(201).json({
      message: "Horário criado com sucesso",
      slot,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao criar horário",
    });
  }
}

export async function findByDoctor(req: Request, res: Response) {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        message: "ID do médico inválido",
      });
    }

    const slots = await listDoctorTimeSlots(doctorId);

    return res.json({
      slots,
    });
  } catch {
    return res.status(400).json({
      message: "Erro ao listar horários",
    });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        message: "ID do horário inválido",
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const result = await deleteTimeSlot(id, user);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao remover horário",
    });
  }
}