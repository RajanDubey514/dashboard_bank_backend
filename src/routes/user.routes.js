import express from "express";
import { registerUser , loginUser, logoutUser, forgotPassword, resetPassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login" , loginUser);
router.post('/logout' , verifyJWT, logoutUser);
router.post('/forgot-password' , forgotPassword);
router.post("/reset-password/:token" , resetPassword);
export default router;