import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  getProfile,
  patientDashboard,
  updateProfile,
  dashboard,
} from "../controllers/patient.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["patient"]));

router.get("/dashboard", patientDashboard);

router.get("/profile", getProfile);

router.put("/profile", updateProfile);
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["patient"]),
  dashboard
);

export default router;