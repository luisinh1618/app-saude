import type { Request, Response } from "express";

import {
  createPrescription,
  listDoctorPrescriptions,
  listPatientPrescriptions,
} from "../services/prescription.service.js";

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const { medicalRecordId, medication, dosage, instructions } = req.body;

    if (!medicalRecordId || !medication || !dosage) {
      return res.status(400).json({
        message: "Prontuário, medicamento e dosagem são obrigatórios",
      });
    }

    const prescription = await createPrescription(userId, {
      medicalRecordId,
      medication,
      dosage,
      instructions,
    });

    return res.status(201).json({
      message: "Receita criada com sucesso",
      prescription,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao criar receita",
    });
  }
}

export async function findDoctorPrescriptions(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const prescriptions = await listDoctorPrescriptions(userId);

    return res.json({ prescriptions });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao listar receitas do médico",
    });
  }
}

export async function findPatientPrescriptions(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const prescriptions = await listPatientPrescriptions(userId);

    return res.json({ prescriptions });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao listar receitas do paciente",
    });
  }
}