import express from "express";
import { registerUser , loginUser, logoutUser, forgotPassword, resetPassword , bulkRegisterStrict} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login" , loginUser);
router.post('/logout' , verifyJWT, logoutUser);
router.post('/forgot-password' , forgotPassword);
router.post("/reset-password/:token" , resetPassword);
router.post("/bulk-register", upload.single("file"), verifyJWT, authorizedRoles("SUPER_ADMIN"),
  bulkRegisterStrict
);
export default router;