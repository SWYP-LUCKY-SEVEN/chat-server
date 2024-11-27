import { Request, Response } from "express";

import User from "@src/models/userModel";
import asyncHandler from "express-async-handler";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import mongoose from "mongoose";
import redisClient from "@src/redis/redis-client";
import { userService } from "@services/index";

const { ObjectId } = mongoose.Types;

interface IError extends Error {
  statusCode: number;
}

function toObjectHexString(number: any): string {
  // 숫자를 16진수 문자열로 변환
  const hexString = number.toString(16);
  console.log(number, hexString)
// 16진수 문자열을 24자리의 문자열로 패딩하여 반환
  return hexString.padStart(24, "0").toString();
}

const createUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { pk, nickname, pic } = req.body;
    const objectId = toObjectHexString(pk) as string;
    const _id = new ObjectId(objectId);

    const existUser = await User.findOne({_id});

    if (existUser) {
      const error = new Error("이미 존재하는 유저") as IError;
      error.statusCode = 403;
      throw error;
    }

    const user = await User.create({
      _id,
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
    const { id } = req.params;

    const objectId = toObjectHexString(id) as string;
    if (!ObjectId.isValid(objectId)) {
      const error = new Error("유효하지 않은 유저 ID") as IError;
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndDelete(objectId);

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
    const { id } = req.params;
    const { nickname, pic } = req.body;

    const objectId = toObjectHexString(id) as string;

    if (!ObjectId.isValid(objectId)) {
      const error = new Error("유효하지 않은 유저 ID") as IError;
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate( objectId,
      { nickname, pic },
      { new: true, runValidators: true }
    );

    if (!user) {
      const error = new Error("유저를 찾을 수 없습니다") as IError;
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
    const memberId = req.user?._id;
    const users = await userService.getUsers(keyword, memberId);
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
