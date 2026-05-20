import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { findDoctorByUserId } from "../services/medical-record.service.js";
import { findPatientByUserId } from "../services/doctor-review.service.js";
import { createMedicalRecordSchema } from "../validations/medical-record.validation.js";

import {
  createMedicalRecord,
  listMedicalRecordsByDoctor,
  listMedicalRecordsByPatient,
} from "../services/medical-record.service.js";

export async function create(req: AuthRequest, res: Response) {
  try {
    const doctorUserId = req.user?.id;

    if (!doctorUserId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const data = createMedicalRecordSchema.parse(req.body);

    const recordPayload = {
      appointmentId: data.appointmentId,
      doctorUserId,
      diagnosis: data.diagnosis,
      ...(data.treatment !== undefined && { treatment: data.treatment }),
      ...(data.notes !== undefined && { notes: data.notes }),
    };

    const record = await createMedicalRecord(recordPayload);

    return res.status(201).json({
      message: "Prontuário criado com sucesso",
      record,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao criar prontuário",
    });
  }
}

export async function findByPatient(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const patient = await findPatientByUserId(userId);

    const records = await listMedicalRecordsByPatient(
      patient.id
    );

    return res.json({
      records,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Erro ao listar prontuários do paciente",
    });
  }
}

export async function findByDoctor(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const doctor = await findDoctorByUserId(userId);

    const records = await listMedicalRecordsByDoctor(
      doctor.id
    );

    return res.json({
      records,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Erro ao listar prontuários do médico",
    });
  }
}