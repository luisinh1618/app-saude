import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  averageRating,
  create,
  findByDoctor,
} from "../controllers/doctor-review.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", roleMiddleware(["patient"]), create);

router.get("/doctor/:doctorId", findByDoctor);

router.get("/doctor/:doctorId/average", averageRating);

export default router;