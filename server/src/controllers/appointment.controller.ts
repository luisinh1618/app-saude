import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../validations/appointment.validation.js";

import {
  createAppointment,
  findDoctorByUserId,
  findPatientByUserId,
  listAppointments,
  listAppointmentsByDoctor,
  listAppointmentsByPatient,
  updateAppointmentStatus,
} from "../services/appointment.service.js";

export async function create(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const data = createAppointmentSchema.parse(req.body);

    const patient = await findPatientByUserId(userId);

    const appointmentPayload = {
      patientId: patient.id,
      doctorId: data.doctorId,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      ...(data.notes !== undefined && { notes: data.notes }),
    };

    const appointment = await createAppointment(appointmentPayload);

    return res.status(201).json({
      message: "Consulta agendada com sucesso",
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao agendar consulta",
    });
  }
}

export async function findAll(req: AuthRequest, res: Response) {
  try {
    const appointments = await listAppointments();

    return res.json({
      appointments,
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar consultas",
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

    const appointments = await listAppointmentsByPatient(patient.id);

    return res.json({
      appointments,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao listar consultas do paciente",
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

    const appointments = await listAppointmentsByDoctor(doctor.id);

    return res.json({
      appointments,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao listar consultas do médico",
    });
  }
}

export async function updateStatus(req: AuthRequest, res: Response) {
  try {
    const appointmentId = req.params.appointmentId;

    if (!appointmentId || Array.isArray(appointmentId)) {
      return res.status(400).json({
        message: "ID da consulta inválido",
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const data = updateAppointmentStatusSchema.parse(req.body);

    const appointment = await updateAppointmentStatus(
      appointmentId,
      data.status,
      user
    );

    return res.json({
      message: "Status da consulta atualizado com sucesso",
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao atualizar status da consulta",
    });
  }
}