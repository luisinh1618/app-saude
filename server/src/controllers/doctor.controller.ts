import type { Request, Response } from "express";

import {
  findDoctorByUserId,
  listDoctors,
  listApprovedDoctors,
  listApprovedDoctorsBySpecialty,
  listDoctorSpecialties,
  addSpecialtyToDoctor,
} from "../services/doctor.service.js";

// 👤 Perfil do médico logado
export async function getProfile(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const doctor = await findDoctorByUserId(userId);

    if (!doctor) {
      return res.status(404).json({
        message: "Médico não encontrado",
      });
    }

    return res.json({ doctor });
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar perfil",
    });
  }
}

// 📋 Listar todos os médicos
export async function findAllDoctors(
  req: Request,
  res: Response
) {
  try {
    const doctors = await listDoctors();

    return res.json({ doctors });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar médicos",
    });
  }
}

// ✅ Listar médicos aprovados
export async function findApprovedDoctors(
  req: Request,
  res: Response
) {
  try {
    const doctors = await listApprovedDoctors();

    return res.json({ doctors });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar aprovados",
    });
  }
}

// 🔎 Buscar médicos por especialidade
export async function findApprovedDoctorsBySpecialty(
  req: Request,
  res: Response
) {
  try {
    const { specialtyId } = req.params;

    if (!specialtyId || Array.isArray(specialtyId)) {
      return res.status(400).json({
        message: "Especialidade inválida",
      });
    }

    const doctors =
      await listApprovedDoctorsBySpecialty(
        specialtyId
      );

    return res.json({ doctors });
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar por especialidade",
    });
  }
}

// 📋 Especialidades do médico
export async function findDoctorSpecialties(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const specialties =
      await listDoctorSpecialties(userId);

    return res.json({ specialties });
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar especialidades",
    });
  }
}

// ➕ Adicionar especialidade ao médico
export async function addSpecialty(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.id;
    const { specialty } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    if (!specialty) {
      return res.status(400).json({
        message: "Especialidade obrigatória",
      });
    }

    const doctor =
      await addSpecialtyToDoctor(
        userId,
        specialty
      );

    if (!doctor) {
      return res.status(404).json({
        message: "Médico não encontrado",
      });
    }

    return res.json({
      message: "Especialidade atualizada",
      doctor,
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao atualizar especialidade",
    });
  }
}

// 📊 Dashboard do médico (ESSENCIAL pro seu erro)
export async function doctorDashboard(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    // ⚠️ Aqui você pode depois puxar dados reais do banco
    const metrics = {
      totalAppointments: 0,
      pendingAppointments: 0,
      completedAppointments: 0,
    };

    return res.json({
      message: "Dashboard carregado com sucesso",
      metrics,
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao carregar dashboard",
    });
  }
}

// ✏️ Atualizar perfil (placeholder)
export async function updateProfile(
  req: Request,
  res: Response
) {
  try {
    return res.json({
      message: "Atualização de perfil ainda não implementada",
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao atualizar perfil",
    });
  }
}