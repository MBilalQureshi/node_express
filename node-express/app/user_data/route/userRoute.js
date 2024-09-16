import express from "express";
import { createUser, getUser, getAllUsers, updateUser, deleteUser, createPost, getAllPosts, login } from "../controller/userController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// User Routes
router.post("/create/user", createUser);
router.get("/get/user/:id", getUser);
router.get("/get/users", getAllUsers);
router.put("/update/user/:id", updateUser);
router.delete("/delete/user/:id", deleteUser);
router.post("/login", login);

//Post Routes
router.post("/create/post", verifyToken, createPost);
router.get("/get/posts",verifyToken, getAllPosts);

export default router;