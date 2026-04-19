import express from "express";
import {
  createAccountStatus,
  deleteAccountStatus,
  getAllAccountStatus,
  updateAccountStatus,
} from "../controllers/GlobalAccountStatus.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


router.post(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN"),
  createAccountStatus,
);

router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN"),
  updateAccountStatus,
);

router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN"),
  deleteAccountStatus,
);

router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN", "USER"),
  getAllAccountStatus,
);

export default router;
