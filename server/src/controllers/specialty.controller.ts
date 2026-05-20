import type { Request, Response } from "express";

import {
  createSpecialty,
  deleteSpecialty,
  listSpecialties,
  updateSpecialty,
} from "../services/specialty.service.js";

import {
  createSpecialtySchema,
  updateSpecialtySchema,
} from "../validations/specialty.validation.js";

export async function create(req: Request, res: Response) {
  try {
    const data = createSpecialtySchema.parse(req.body);

    const specialty = await createSpecialty(data);

    return res.status(201).json({
      message: "Especialidade criada com sucesso",
      specialty,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao criar especialidade",
    });
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const specialties = await listSpecialties();

    return res.json({
      specialties,
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar especialidades",
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const data = updateSpecialtySchema.parse(req.body);

    const specialty = await updateSpecialty(id, data);

    return res.json({
      message: "Especialidade atualizada com sucesso",
      specialty,
    });
  } catch (error: any) {
    return res.status(400).json({
      message:
        error.errors?.[0]?.message ||
        error.message ||
        "Erro ao atualizar especialidade",
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const result = await deleteSpecialty(id);

    return res.json(result);
  } catch {
    return res.status(400).json({
      message: "Erro ao remover especialidade",
    });
  }
}