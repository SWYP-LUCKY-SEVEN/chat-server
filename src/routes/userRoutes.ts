import express from "express";
import { protect } from "@middlewares/authMiddleware";
import { userController } from "@controllers/index";

const router = express.Router();
router.get("/", protect, userController.getUsers);
router.post("/", userController.createUser);
router.delete("/:userId", userController.deleteUser);
router.patch("/:userId", userController.updateUser);
router.post("/sign-up", userController.signUpUser);
router.post("/sign-in", userController.signInUser);

export default router;
