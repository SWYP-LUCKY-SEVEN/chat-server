import { chatController } from "@controllers/index";
import express from "express";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();
router.get("/:studyId", protect, chatController.getChat);
router.post("/study", chatController.createGroupChat);
router.put("/group", protect, chatController.updateGroupChat);
router.put("/group/name", protect, chatController.updateChatName);
router.put("/group/remove", protect, chatController.removeFromGroup);
router.put("/group/add", protect, chatController.addToGroup);
router.put("/record/join/:studyId", protect, chatController.recordUserJoin);
router.put("/record/out/:studyId", protect, chatController.recordUserOut);
router.put("/group/:studyId", protect, chatController.deleteChat);

router.delete("/group/user/:userId", chatController.leaveFromChat);

router.post("/group/:studyId/notice", protect, chatController.createChatNotification);
router.put("/group/:studyId/notice", protect, chatController.editChatNotification);
router.put("/group/:studyId/notice/cancel", protect, chatController.demoteChatNotification);
router.delete("/group/:studyId/notice", protect, chatController.removeChatNotification);
router.get("/group/:studyId/notice/all", protect, chatController.getAllNoticeInChat);
router.get("/group/:studyId/notice", protect, chatController.getNoticeInChat);
export default router;
