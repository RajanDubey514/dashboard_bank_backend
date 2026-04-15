import express from "express";
import { createTestUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/create-user", createTestUser);
router.post("/create-user", createTestUser);


export default router;