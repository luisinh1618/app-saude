import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";

type UserRole = "patient" | "doctor" | "admin";

export function roleMiddleware(allowedRoles: UserRole[]) {
  return function (req: AuthRequest, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Usuário não autenticado",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Acesso negado para este perfil de usuário",
      });
    }

    return next();
  };
}