import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  create,
  findByDoctor,
  findByPatient,
} from "../controllers/exam-request.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", roleMiddleware(["doctor"]), create);

router.get("/patient", roleMiddleware(["patient"]), findByPatient);

router.get("/doctor", roleMiddleware(["doctor"]), findByDoctor);

export default router;