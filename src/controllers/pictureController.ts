import { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import mongoose from "mongoose";
import { pictureService } from "@services/index";

function toObjectHexString(number: any): string {
    // 숫자를 16진수 문자열로 변환
    const hexString = number.toString(16);
    // 16진수 문자열을 24자리의 문자열로 패딩하여 반환
    return hexString.padStart(24, "0").toString();
  }
interface IError extends Error {
    statusCode: number;
  }

const getPictureData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { picId } = req.params;
        const objectPicId = toObjectHexString(picId);
        const result = await pictureService.getPictureData(objectPicId);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})
const getChatGallery = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const objectChatId = toObjectHexString(chatId);
        const result = await pictureService.getChatGallery(objectChatId);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})
const getChatSimpleGallery = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const objectChatId = toObjectHexString(chatId);
        const result = await pictureService.getChatSimpleGallery(objectChatId, 3);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})

const postPicture = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { url } = req.body;
        const { chatId } = req.params;
        const reqUserId = req.user?._id;
        const objectChatId = toObjectHexString(chatId);
        const result = await pictureService.postPicture(url, objectChatId, reqUserId);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})

export default {
    getPictureData,
    getChatGallery,
    getChatSimpleGallery,
    postPicture
  };
  