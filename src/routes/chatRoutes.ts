import { chatController } from "@controllers/index";
import express from "express";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();
router.get("/:studyId", protect, chatController.getChat);
router.post("/study", chatController.createGroupChat);
router.put("/group", protect, chatController.updateGroupChat);
router.put("/group/name", protect, chatController.updateChatName);
router.put("/group/remove", protect, chatController.userRemoveFromGroup);
router.put("/group/add", protect, chatController.userAddToGroup);
router.put("/record/join/:studyId", protect, chatController.recordUserJoin);
router.put("/record/out/:studyId", protect, chatController.recordUserOut);
router.delete("/group/:studyId", protect, chatController.deleteChat);

router.delete("/group/user/:userId", chatController.leaveFromChat);

router.post("/:studyId/group/notice/:messageIdx", protect, chatController.enrollChatNotification);
router.post("/:studyId/group/notice", protect, chatController.createChatNotification);
router.put("/:studyId/group/notice", protect, chatController.editChatNotification);
router.put("/:studyId/group/notice/cancel", protect, chatController.demoteChatNotification);
router.delete("/:studyId/group/notice", protect, chatController.removeChatNotification);
router.get("/:studyId/group/notice/all", protect, chatController.getAllNoticeInChat);
router.get("/:studyId/group/notice", protect, chatController.getNoticeInChat);
export default router;
