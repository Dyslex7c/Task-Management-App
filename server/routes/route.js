import express from "express";
import { login, register } from "../controllers/auth.js";
import { createTask, deleteTask, editTask, retrieveTasks } from "../controllers/tasks.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/tasks", authenticateToken, createTask);
router.get("/tasks", authenticateToken, retrieveTasks);
router.put("/tasks/:id", authenticateToken, editTask);
router.delete("/tasks/:id", authenticateToken, deleteTask);

export default router;