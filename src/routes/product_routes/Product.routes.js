import express from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { authorizedRoles } from "../../middlewares/role.middleware.js";
import { createProduct, deleteProduct, getAllProducts, updateProduct, updateProductImage } from "../../controllers/prduct_controllers/Product.controller.js";
import { uploadImage } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  createProduct,
);


router.patch(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  updateProduct,
);


router.get(
  "/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN" , "USER"),
  getAllProducts,
);


router.delete(
  "/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" ),
  deleteProduct,
);

router.patch(
  "/update-image/:id",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN"),
  uploadImage.single("product_img"),
  updateProductImage
);

export default router;