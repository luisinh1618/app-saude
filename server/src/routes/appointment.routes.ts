import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  create,
  findAll,
  findByDoctor,
  findByPatient,
  updateStatus,
} from "../controllers/appointment.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", roleMiddleware(["patient", "admin"]), create);

router.get("/", roleMiddleware(["admin"]), findAll);

router.get("/patient", roleMiddleware(["patient"]), findByPatient);

router.get("/doctor", roleMiddleware(["doctor"]), findByDoctor);

router.put(
  "/:appointmentId/status",
  roleMiddleware(["doctor", "admin"]),
  updateStatus
);

export default router;