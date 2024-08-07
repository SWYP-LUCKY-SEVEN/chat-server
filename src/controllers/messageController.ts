import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { messageService } from "@services/index";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

interface IError extends Error {
  statusCode: number;
}

const getAllMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const user = await messageService.getAllMessages(chatId);
    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const getRecentMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const user = await messageService.getRecentMessages(chatId, 0, 30);
    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reqUserId = req.user?._id;

    if (reqUserId) {
      res.status(201).json(req.body);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});


const sendPicture = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { content, chatId } = req.body;
    const reqUserId = req.user?._id;

    if (reqUserId) {
      const user = await messageService.sendMessage(content, chatId, reqUserId);
      res.status(201).json(user);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});
export default {
  getAllMessages,
  getRecentMessages,
  sendMessage,
};
