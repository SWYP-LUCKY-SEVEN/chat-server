import express from "express";
import { messageController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();

router.route("/:chatId").get(protect, messageController.getAllMessages);
router.route("/:chatId/recent").get(protect, messageController.getRecentMessages);
router.route("/").post(protect, messageController.sendMessage);

export default router;
