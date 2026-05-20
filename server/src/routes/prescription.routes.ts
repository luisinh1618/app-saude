import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  create,
  findDoctorPrescriptions,
  findPatientPrescriptions,
} from "../controllers/prescription.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["doctor"]),
  create
);

router.get(
  "/doctor",
  authMiddleware,
  roleMiddleware(["doctor"]),
  findDoctorPrescriptions
);

router.get(
  "/patient",
  authMiddleware,
  roleMiddleware(["patient"]),
  findPatientPrescriptions
);

export default router;