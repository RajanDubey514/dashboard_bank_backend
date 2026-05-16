import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizedRoles } from "../../middlewares/role.middleware.js";
import { createProductSubGroup, deleteProductSubGroup, getAllProductSubGroup, updateProductSubGroup } from "../../controllers/prduct_controllers/SubGroup.controller.js";

const router = express.Router();


router.post(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  createProductSubGroup,
);


router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  updateProductSubGroup,
);


router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN" , "USER"),
  getAllProductSubGroup,
);


router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  deleteProductSubGroup,
);

export default router;
