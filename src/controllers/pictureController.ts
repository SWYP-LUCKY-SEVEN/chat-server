import { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import mongoose from "mongoose";
import { pictureService } from "@services/index";
import { toObjectId } from "@src/configs/toObjectId";

interface IError extends Error {
    statusCode: number;
  }

const getPictureData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { picId } = req.params;
        const picObjectId = toObjectId(picId);
        const result = await pictureService.getPictureData(picObjectId);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})
const getChatGallery = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { studyId } = req.params;
        const chatId = toObjectId(studyId);
        const result = await pictureService.getChatGallery(chatId);
        res.status(201).json(result);
      } catch (error: any) {
        errorLoggerMiddleware(error as IError, req, res);
        res.status(error.statusCode).json(error.message);
      }
})
const getChatSimpleGallery = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { study } = req.params;
        const chatId = toObjectId(study);
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
        const { study } = req.params;
        const reqUserId = req.user?._id;
        const chatId = toObjectId(study);
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
  