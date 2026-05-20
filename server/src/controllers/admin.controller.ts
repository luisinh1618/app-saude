import type { Request, Response } from "express";

import { getAdminDashboardMetrics } from "../services/dashboard.service.js";

import {
  listUsers,
  toggleUserStatus,
} from "../services/admin-user.service.js";

import {
  approveDoctor,
  listPendingDoctors,
  rejectDoctor,
} from "../services/doctor.service.js";

export async function adminDashboard(req: Request, res: Response) {
  try {
    const metrics = await getAdminDashboardMetrics();

    return res.json({
      message: "Dashboard do admin carregado com sucesso",
      metrics,
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao carregar dashboard do admin",
    });
  }
}

export async function findPendingDoctors(req: Request, res: Response) {
  try {
    const doctors = await listPendingDoctors();

    return res.json({
      doctors,
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar médicos pendentes",
    });
  }
}

export async function approve(req: Request, res: Response) {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        message: "ID do médico inválido",
      });
    }

    const result = await approveDoctor(doctorId);

    return res.json({
      message: "Médico aprovado com sucesso",
      doctor: result,
    });
  } catch {
    return res.status(400).json({
      message: "Erro ao aprovar médico",
    });
  }
}

export async function reject(req: Request, res: Response) {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId || Array.isArray(doctorId)) {
      return res.status(400).json({
        message: "ID do médico inválido",
      });
    }

    const result = await rejectDoctor(doctorId);

    return res.json({
      message: "Médico rejeitado com sucesso",
      doctor: result,
    });
  } catch {
    return res.status(400).json({
      message: "Erro ao rejeitar médico",
    });
  }
}

export async function findAllUsers(req: Request, res: Response) {
  try {
    const users = await listUsers();

    return res.json({
      users,
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar usuários",
    });
  }
}

export async function toggleStatus(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({
        message: "ID do usuário inválido",
      });
    }

    const result = await toggleUserStatus(userId);

    return res.json({
      message: "Status do usuário atualizado com sucesso",
      user: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao atualizar status do usuário",
    });
  }
}