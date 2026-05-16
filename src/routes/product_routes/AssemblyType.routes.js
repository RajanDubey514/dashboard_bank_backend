import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizedRoles } from "../../middlewares/role.middleware.js";
import { createProductAssemblyType, deleteProductAssemblyType, getAllProductAssemblyType, UpdateProductAssemblyType } from "../../controllers/prduct_controllers/AssemblyType.controller.js";

const router = express.Router();


router.post(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  createProductAssemblyType,
);


router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  UpdateProductAssemblyType,
);


router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN" , "USER"),
  getAllProductAssemblyType,
);


router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  deleteProductAssemblyType,
);

export default router;