import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

import {
  loginUser,
  registerUser,
  getUserById,
} from "../services/auth.service.js";

import {
  loginSchema,
  registerSchema,
} from "../validations/auth.validation.js";

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const result = await registerUser(data);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.errors?.[0]?.message || error.message || "Erro ao cadastrar usuário",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data.email, data.password);

    return res.json({
      message: "Login realizado com sucesso",
      ...result,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.errors?.[0]?.message || error.message || "Erro ao fazer login",
    });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    const user = await getUserById(userId);

    return res.json({
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Erro ao buscar usuário",
    });
  }
}