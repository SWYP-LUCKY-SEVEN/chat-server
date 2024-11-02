import express from "express";
import { messageController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();

router.route("/:chatId").get(protect, messageController.getAllMessages);
router.route("/:chatId/recent").get(protect, messageController.getRecentMessages);
router.route("/:chatId/message/text").get(protect, messageController.findMessageByText);
router.route("/:chatId/message/index").get(protect, messageController.findMessageByIndex);

router.route("/").post(protect, messageController.sendMessage);

export default router;
