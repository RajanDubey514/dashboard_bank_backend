import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/role.middleware.js";
import { getAllUsers, getMyProfile, toggleUserStatus, updateMyProfile, updateUserAvatar, updateUserCoverImage } from "../controllers/AllUsers.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router()

router.get(
  "/users",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  getAllUsers,
);


router.patch(
  "/users/status/:id/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN"),
  toggleUserStatus
);


router.get("/me", verifyJWT, getMyProfile);
router.patch("/me", verifyJWT, updateMyProfile);

router.patch(
  "/me/avatar",
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);

router.patch(
  "/me/cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);

export default router