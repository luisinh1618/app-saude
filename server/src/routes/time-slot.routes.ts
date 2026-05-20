import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  create,
  findByDoctor,
  remove,
} from "../controllers/time-slot.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", roleMiddleware(["doctor", "admin"]), create);

router.get("/doctor/:doctorId", findByDoctor);

router.delete("/:id", roleMiddleware(["doctor", "admin"]), remove);

export default router;