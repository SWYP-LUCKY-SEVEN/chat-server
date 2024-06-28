import express from "express";
import { pictureController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();

router.route("/:picId").get(protect, pictureController.getPictureData);
router.route("/gallery/:chatId").get(protect, pictureController.getChatGallery);
router.route("/side/:chatId").post(protect, pictureController.getChatSimpleGallery);

export default router;