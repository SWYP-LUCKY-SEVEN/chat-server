import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { messageService, chatService } from "@services/index";
import { toObjectHexString } from "@src/configs/toObjectId";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

interface IError extends Error {
  statusCode: number;
}

const getAllMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    
    if(!Number(chatId)) {
      res.status(404).json({ message: "입력값 오류입니다." });
    }
    
    const chatObjectId = toObjectHexString(chatId);

    const user = await messageService.getAllMessages(chatObjectId);
    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const getRecentMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    
    if(!Number(chatId)) {
      res.status(404).json({ message: "입력값 오류입니다." });
    }

    const chatObjectId = toObjectHexString(chatId);

    const user = await messageService.getRecentMessages(chatObjectId, 0, 30);
    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const getMessagesByRange = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reqUserId = req.user?._id;
    // 유저 검증 필요.
    const { chatId } = req.params;
    const { startIndex, range } = req.query;

    if(!Number(chatId) || !startIndex) {
      res.status(404).json({ message: "입력값 오류입니다." });
    }

    const chatObjectId = toObjectHexString(chatId);
    const reqUserObjectId = toObjectHexString(reqUserId);

    await chatService.isRoomAuth(chatObjectId, reqUserObjectId);

    const startIndexNum = parseInt(startIndex as string, 10);

    let targetIndex = startIndexNum;
    if (!range) {
      targetIndex += parseInt(process.env.CHAT_MESSAGE_RANGE_DEFAULT!, 10); //default 30
    } else {
      targetIndex += parseInt(range as string, 10);
    }

    const messages = await messageService.findMessagesBetweenIndex(chatId, startIndexNum, targetIndex);
    
    res.status(200).json(messages);

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
    const { startIndex, findText } = req.query;

    if(!Number(chatId) || !startIndex || !findText) {
      res.status(404).json({ message: "입력값 오류입니다." });
    }

    const chatObjectId = toObjectHexString(chatId);
    const reqUserObjectId = toObjectHexString(reqUserId);

    await chatService.isRoomAuth(chatObjectId, reqUserObjectId);

    const startIndexNum = parseInt(startIndex as string, 10);

    const indexList = await messageService.findMessagesByContent(chatObjectId, findText as string);

    const messages = await messageService.findMessagesBetweenIndex(chatObjectId, startIndexNum, indexList.at(0)!.valueOf())

    res.status(200).json({ indexList, messages });

  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const findMessagesBetweenIndex = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reqUserId = req.user?._id;
    // 유저 검증 필요.

    const { chatId } = req.params;
    const { findIndex, startIndex } = req.query;

    if(!Number(chatId) || !findIndex || !startIndex) {
      res.status(404).json({ message: "입력값 오류입니다." });
    }

    const chatObjectId = toObjectHexString(chatId);
    const reqUserObjectId = toObjectHexString(reqUserId);

    await chatService.isRoomAuth(chatObjectId, reqUserObjectId);

    const findIndexNum = parseInt(findIndex as string, 10);
    const startIndexNum = parseInt(startIndex as string, 10);

    const messages = await messageService.findMessagesBetweenIndex(chatObjectId, startIndexNum, findIndexNum);

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
    const reqUserId = req.user?._id;
    const { content, chatId } = req.body;

    const chatObjectId = toObjectHexString(chatId);
    const reqUserObjectId = toObjectHexString(reqUserId);

    await chatService.isRoomAuth(chatObjectId, reqUserObjectId);

    if (reqUserId) {
      const user = await messageService.sendMessage(content, chatObjectId, reqUserObjectId);
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
  getMessagesByRange,
  sendMessage,
  findMessageByText,
  findMessagesBetweenIndex
};
