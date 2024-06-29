import chatRouter from "./chatRoutes";
import express from "express";
import messageRouter from "./messageRoutes";
import pictureRouter from "./pictureRoutes";
import userRouter from "./userRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);
router.use("/picture", pictureRouter);

export default router;
