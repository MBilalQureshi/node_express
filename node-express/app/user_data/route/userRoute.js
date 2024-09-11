import express from "express";
import { createUser, getUser, getAllUsers, updateUser, deleteUser, createPost, getAllPosts } from "../controller/userController.js";

const router = express.Router();

// User Routes
router.post("/create/user", createUser);
router.get("/get/user/:id", getUser);
router.get("/get/users", getAllUsers);
router.put("/update/user/:id", updateUser);
router.delete("/delete/user/:id", deleteUser);

//Post Routes
router.post("/create/post", createPost);
router.get("/get/posts", getAllPosts);

export default router;