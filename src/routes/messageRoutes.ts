import express from "express";
import { messageController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();

router.route("/:studyId").get(protect, messageController.getAllMessages);
router.route("/:studyId/recent").get(protect, messageController.getRecentMessages);
router.route("/:studyId/range").get(protect, messageController.getMessagesByRange);
router.route("/:studyId/text").get(protect, messageController.findMessageByText);
router.route("/:studyId/index").get(protect, messageController.findMessagesBetweenIndex);

router.route("/").post(protect, messageController.sendMessage);

export default router;
