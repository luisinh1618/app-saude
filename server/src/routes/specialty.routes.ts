import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  create,
  findAll,
  remove,
  update,
} from "../controllers/specialty.controller.js";

const router = Router();

router.get("/", authMiddleware, findAll);

router.post("/", authMiddleware, roleMiddleware(["admin"]), create);

router.put("/:id", authMiddleware, roleMiddleware(["admin"]), update);

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), remove);

export default router;