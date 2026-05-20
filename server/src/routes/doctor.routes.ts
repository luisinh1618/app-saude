import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  doctorDashboard,
  findAllDoctors,
  findApprovedDoctors,
  findApprovedDoctorsBySpecialty,
  findDoctorSpecialties,
  addSpecialty,
  getProfile,
  updateProfile,
} from "../controllers/doctor.controller.js";

const router = Router();

// 📊 Dashboard do médico
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["doctor"]),
  doctorDashboard
);

// 📋 Listar todos os médicos
router.get(
  "/",
  authMiddleware,
  findAllDoctors
);

// ✅ Médicos aprovados
router.get(
  "/approved",
  authMiddleware,
  findApprovedDoctors
);

// 🔎 Médicos por especialidade
router.get(
  "/specialty/:specialtyId",
  authMiddleware,
  findApprovedDoctorsBySpecialty
);

// ➕ Adicionar especialidade ao médico
router.post(
  "/:doctorId/specialties",
  authMiddleware,
  roleMiddleware(["admin"]),
  addSpecialty
);

// 📋 Buscar especialidades do médico
router.get(
  "/:doctorId/specialties",
  authMiddleware,
  findDoctorSpecialties
);

// 👤 Perfil do médico logado
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(["doctor"]),
  getProfile
);

// ✏️ Atualizar perfil do médico
router.put(
  "/profile",
  authMiddleware,
  roleMiddleware(["doctor"]),
  updateProfile
);

export default router;