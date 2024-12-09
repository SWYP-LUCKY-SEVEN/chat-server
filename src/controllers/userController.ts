import { Request, Response } from "express";

import User from "@src/models/userModel";
import asyncHandler from "express-async-handler";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import mongoose from "mongoose";
import redisClient from "@src/redis/redis-client";
import { userService } from "@services/index";
import { toObjectId } from "@src/configs/utill";

const { ObjectId } = mongoose.Types;

interface IError extends Error {
  statusCode: number;
}

const createUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId, nickname, pic } = req.body;

    const userObjectId = toObjectId(userId);

    const existUser = await User.findOne({userObjectId});

    if (existUser) {
      const error = new Error("이미 존재하는 유저") as IError;
      error.statusCode = 403;
      throw error;
    }

    console.log(userObjectId)
    const user = await User.create({
      _id: userObjectId,
      nickname,
      pic,
    });

    console.log(user)

    if (user) {
      res.status(201).json(user);
    } else {
      const error = new Error("유저 생성에 실패") as IError;
      error.statusCode = 500;
      throw error;
    }
  } catch (error: any) {
    console.log(error)
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userObjectId = toObjectId(userId);
    if (!ObjectId.isValid(userObjectId)) {
      const error = new Error("유효하지 않은 유저 ID") as IError;
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndDelete(userObjectId);

    if (!user) {
      const error = new Error("유저를 찾을 수 없습니다") as IError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "유저 삭제 완료" });
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { nickname, pic } = req.body;


    const userObjectId = toObjectId(userId);

    if (!ObjectId.isValid(userObjectId)) {
      const error = new Error("유효하지 않은 유저 ID") as IError;
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate( userObjectId,
      { nickname, pic },
      { new: true, runValidators: true }
    );

    if (!user) {
      const error = new Error("멤버를 찾을 수 없습니다") as IError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { nickname, email, password, pic } = req.body;
    const user = await userService.signUpUser(nickname, email, password, pic);
    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const signInUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { nickname } = req.body;
    const user = await userService.signInUser(nickname);
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error)
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const keyword = req.query.search;
    const reqUserId = req.user?._id;
    const users = await userService.getUsers(keyword, reqUserId);
    res.status(200).json(users);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});
export default {
  createUser,
  deleteUser,
  updateUser,
  signUpUser,
  signInUser,
  getUsers,
};
