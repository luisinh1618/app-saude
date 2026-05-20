import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { createExamRequestSchema } from "../validations/exam-request.validation.js";

import {
  createExamRequest,
  findDoctorByUserId,
  findPatientByUserId,
  listExamRequestsByDoctor,
  listExamRequestsByPatient,
} from "../services/exam-request.service.js";

export async function create(req: AuthRequest, res: Response) {
  try {
    const doctorUserId = req.user?.id;

    if (!doctorUserId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const data = createExamRequestSchema.parse(req.body);

    const examRequestPayload = {
      medicalRecordId: data.medicalRecordId,
      doctorUserId,
      examName: data.examName,
      ...(data.reason !== undefined && { reason: data.reason }),
      ...(data.instructions !== undefined && {
        instructions: data.instructions,
      }),
    };

    const examRequest = await createExamRequest(examRequestPayload);

    return res.status(201).json({
      message: "Solicitação de exame criada com sucesso",
      examRequest,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao solicitar exame",
    });
  }
}

export async function findByPatient(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const patient = await findPatientByUserId(userId);

    const examRequests = await listExamRequestsByPatient(patient.id);

    return res.json({
      examRequests,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao listar exames do paciente",
    });
  }
}

export async function findByDoctor(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const doctor = await findDoctorByUserId(userId);

    const examRequests = await listExamRequestsByDoctor(doctor.id);

    return res.json({
      examRequests,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao listar exames do médico",
    });
  }
}