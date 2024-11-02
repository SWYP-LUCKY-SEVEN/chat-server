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

const findMessageByText = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reqUserId = req.user?._id;
    // 유저 검증 필요.

    const { chatId } = req.params;
    const { findText, startIndex } = req.body;

    const startIndexNum = parseInt(startIndex, 10);

    const indexList = await messageService.findMessagesByContent(chatId, findText);

    const messages = await messageService.findMessagesBetweenIndex(chatId, startIndexNum, indexList.at(0)!)

    res.status(200).json({ indexList, messages });

  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const findMessageByIndex = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reqUserId = req.user?._id;
    // 유저 검증 필요.

    const { chatId } = req.params;
    const { findIndex, startIndex } = req.body;

    if (!findIndex || !startIndex) {
      res.status(404).json({ message: "입력값 오류입니다." });
    }
    const findIndexNum = parseInt(findIndex, 10);
    const startIndexNum = parseInt(startIndex, 10);

    const messages = await messageService.findMessagesBetweenIndex(chatId, startIndexNum, findIndexNum)
    
    res.status(200).json(messages);

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
  findMessageByText,
  findMessageByIndex
};
