import type { Response } from "express";

import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { getPatientDashboardMetrics } from "../services/dashboard.service.js";
import { findPatientByUserId } from "../services/appointment.service.js";
import {
  getPatientProfileByUserId,
  updatePatientProfileByUserId,
} from "../services/patient.service.js";

export async function patientDashboard(req: AuthRequest, res: Response) {
  return res.json({
    message: "Área do paciente acessada com sucesso",
    user: req.user,
  });
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const patient = await getPatientProfileByUserId(userId);

    return res.json({
      patient,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao buscar perfil do paciente",
    });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const patient = await updatePatientProfileByUserId(userId, req.body);

    return res.json({
      message: "Perfil do paciente atualizado com sucesso",
      patient,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao atualizar perfil do paciente",
    });
  }
}
export async function dashboard(
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

    const metrics = await getPatientDashboardMetrics(
      patient.id
    );

    return res.json({
      message:
        "Dashboard do paciente carregado com sucesso",
      metrics,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.message ||
        "Erro ao carregar dashboard do paciente",
    });
  }
}