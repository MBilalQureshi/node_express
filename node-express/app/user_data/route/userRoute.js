import express from "express";
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from "../controller/userController.js";

const router = express.Router();

// Create a new user route
router.post("/create/user", createUser);
router.get("/get/user/:username", getUser);
router.get("/get/users", getAllUsers);
router.put("/update/user/:username", updateUser);
router.delete("/delete/user/:username", deleteUser);

export default router;