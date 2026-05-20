import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  create,
  findByDoctor,
  findByPatient,
} from "../controllers/medical-record.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware(["doctor"]),
  create
);

router.get(
  "/patient",
  roleMiddleware(["patient", "doctor", "admin"]),
  findByPatient
);

router.get(
  "/doctor",
  roleMiddleware(["doctor", "admin"]),
  findByDoctor
);

export default router;