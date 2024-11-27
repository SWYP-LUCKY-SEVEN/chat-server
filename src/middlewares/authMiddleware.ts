import "@configs/env";

import { NextFunction, Request, Response } from "express";

import Member from "@src/models/memberModel";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { toObjectId } from "@src/configs/toObjectId";

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          sub: any; id?: string 
};
        const userId = decoded.sub
        req.member = await Member.findById(toObjectId(userId)) || undefined;
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export { protect };

