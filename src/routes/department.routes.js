import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/role.middleware.js";
import { createDepartment, deleteDepartment, getAllDepartmentStatus, updateDepartment } from "../controllers/globalDepartmentStatus.controller.js";

const router = express.Router()


router.post("/", verifyJWT, authorizedRoles("SUPER_ADMIN"), createDepartment);

router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN", "USER"),
  getAllDepartmentStatus
);

router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN"),
  updateDepartment
);

router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN"),
  deleteDepartment
);

export default router