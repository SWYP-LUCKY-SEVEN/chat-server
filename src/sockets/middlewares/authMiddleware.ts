import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { Request, Response, NextFunction} from "express";
import User from "@models/userModel";
import asyncHandler from "express-async-handler";
import { toObjectHexString } from "@src/configs/toObjectHexString";
import { IncomingMessage } from 'http';
import IUserDTO from '@src/dtos/userDto';

const JWT_SECRET = process.env.JWT_SECRET as string;

const decodeJWTMiddleware = (socket: Socket, next: (err?: any) => void) => {
    const authToken = socket.handshake?.auth.token;
        
    if (!authToken) {
        console.log("no token");
        return next(new Error("no token"));
    }
    
    if (!authToken.startsWith("Bearer ")){ 
        console.log("invalid token");
        return next(new Error("invalid token"));
    }
        
    const token = authToken.substring(7);

    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
        if (err) {
          console.error("Error decoding token:", err);
          return next(new Error("Not authorized, token invalid"));
        }
        try {
          const pk = decoded.sub;
          const user = await User.findById(toObjectHexString(pk));
          if (user) {
            (socket as Socket & { user: IUserDTO }).user = user;
            next();
          } else {
            throw new Error("User not found");
          }
        } catch (error) {
          console.error("Error finding user:", error);
          next(new Error("Not authorized, user not found"));
        }
    });
}

export { decodeJWTMiddleware };