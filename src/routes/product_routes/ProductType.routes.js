import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizedRoles } from "../../middlewares/role.middleware.js";
import { createProductType, deleteProductType, getAllProductType, UpdateProductType } from "../../controllers/prduct_controllers/ProductType.controller.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  createProductType,
);

router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  UpdateProductType,
);

router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN" , "USER"),
  getAllProductType,
);

router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  deleteProductType,
);

export default router;
