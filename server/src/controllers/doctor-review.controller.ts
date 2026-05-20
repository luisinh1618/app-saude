import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import {
  createDoctorReview,
  findPatientByUserId,
  getDoctorAverageRating,
  listDoctorReviews,
} from "../services/doctor-review.service.js";

import { createDoctorReviewSchema } from "../validations/doctor-review.validation.js";

export async function create(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const data = createDoctorReviewSchema.parse(req.body);

    const patient = await findPatientByUserId(userId);

    const reviewPayload = {
      patientId: patient.id,
      doctorId: data.doctorId,
      appointmentId: data.appointmentId,
      rating: data.rating,
      ...(data.comment !== undefined && { comment: data.comment }),
    };

    const review = await createDoctorReview(reviewPayload);

    return res.status(201).json({
      message: "Avaliação criada com sucesso",
      review,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao criar avaliação",
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

    const reviews = await listDoctorReviews(doctorId);

    return res.json({
      reviews,
    });
  } catch {
    return res.status(400).json({
      message: "Erro ao listar avaliações",
    });
  }
}

export async function averageRating(req: Request, res: Response) {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        message: "ID do médico inválido",
      });
    }

    const result = await getDoctorAverageRating(doctorId);

    return res.json(result);
  } catch {
    return res.status(400).json({
      message: "Erro ao calcular média de avaliação",
    });
  }
}