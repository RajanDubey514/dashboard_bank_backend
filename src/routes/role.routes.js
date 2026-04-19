import express from "express";
import { authorizedRoles } from "../middlewares/role.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createRoleStatus,
  deleteRoleStatus,
  getAllRoleStatus,
  updateRoleStatus,
} from "../controllers/globalRole.controller.js";

const router = express.Router();

router.post("/", verifyJWT, authorizedRoles("SUPER_ADMIN"), createRoleStatus);
router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN", "USER"),
  getAllRoleStatus,
);
router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN"),
  updateRoleStatus,
);
router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN"),
  deleteRoleStatus,
);

export default router;
