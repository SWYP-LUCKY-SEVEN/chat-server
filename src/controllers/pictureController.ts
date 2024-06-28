import { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import mongoose from "mongoose";
import { pictureService } from "@services/index";

interface IError extends Error {
    statusCode: number;
  }

const getPictureData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { picId } = req.params;
        const result = await pictureService.getPictureData(picId);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})
const getChatGallery = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const result = await pictureService.getChatGallery(chatId);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})
const getChatSimpleGallery = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const result = await pictureService.getChatSimpleGallery(chatId, 3);
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
        const result = await pictureService.postPicture(url, chatId, reqUserId);
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
  