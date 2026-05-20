import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  adminDashboard,
  approve,
  findAllUsers,
  findPendingDoctors,
  reject,
  toggleStatus,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/dashboard", adminDashboard);

router.get("/doctors/pending", findPendingDoctors);

router.put("/doctors/:doctorId/approve", approve);

router.put("/doctors/:doctorId/reject", reject);
router.get("/users", findAllUsers);

router.put("/users/:userId/toggle-status", toggleStatus);


export default router;