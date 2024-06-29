import express from "express";
import { pictureController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();

router.route("/:picId").get(protect, pictureController.getPictureData);
router.route("/gallery/:chatId").get(protect, pictureController.getChatGallery);
router.route("/side/:chatId").get(protect, pictureController.getChatSimpleGallery);

router.route("/:chatId").post(protect, pictureController.postPicture);

export default router;