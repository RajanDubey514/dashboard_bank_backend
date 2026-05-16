import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizedRoles } from "../../middlewares/role.middleware.js";
import { createProductGroup, deleteProductGroup, getAllProductGroup, UpdateProductGroup } from "../../controllers/prduct_controllers/MainGroup.controller.js";

const router = express.Router();


router.post(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  createProductGroup,
);


router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  UpdateProductGroup,
);


router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN" , "USER"),
  getAllProductGroup,
);


router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  deleteProductGroup,
);

export default router;