import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/role.middleware.js";
import { getAllUsers, getMyProfileInfo, updateRegisterUser, updateMyProfileInfo, updateUserAvatar, updateUserCoverImage } from "../controllers/allUsers.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router()

router.get(
  "/users",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN" , "ADMIN"),
  getAllUsers,
);


router.patch(
  "/users/:id/",
  verifyJWT,
  authorizedRoles("SUPER_ADMIN", "ADMIN"),
  updateRegisterUser
);


router.get("/me", verifyJWT, getMyProfileInfo);
router.patch("/me", verifyJWT, updateMyProfileInfo);

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