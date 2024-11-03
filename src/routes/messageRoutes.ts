import express from "express";
import { messageController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();

router.route("/:chatId").get(protect, messageController.getAllMessages);
router.route("/:chatId/recent").get(protect, messageController.getRecentMessages);
router.route("/:chatId/range").get(protect, messageController.getMessagesByRange);
router.route("/:chatId/text").get(protect, messageController.findMessageByText);
router.route("/:chatId/index").get(protect, messageController.findMessagesBetweenIndex);

router.route("/").post(protect, messageController.sendMessage);

export default router;
