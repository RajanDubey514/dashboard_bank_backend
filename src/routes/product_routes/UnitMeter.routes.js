import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizedRoles } from "../../middlewares/role.middleware.js";
import { createUnitMeter, UpdateUnitMeter , getAllUnitMeter , deleteUnitMeter} from "../../controllers/prduct_controllers/UnitMeter.controllrs.js";

const router = express.Router();


router.post(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  createUnitMeter,
);


router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  UpdateUnitMeter,
);


router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN" , "USER"),
  getAllUnitMeter,
);


router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  deleteUnitMeter,
);

export default router;
