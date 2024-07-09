import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { Request, Response, NextFunction} from "express";
import User from "@models/userModel";
import asyncHandler from "express-async-handler";
import { toObjectHexString } from "@src/configs/toObjectHexString";

const JWT_SECRET = process.env.JWT_SECRET as string;

const decodeJWTMiddleware = asyncHandler( 
    async (req: Request, res: Response, next: NextFunction) => {
        if(req.query.sid !== undefined)  // Handshake가 아닌경우
            return next();
        
        const authToken = req.headers["authorization"];
        
        if (!authToken) 
            return next(new Error("no token"));
        
        if (!authToken.startsWith("Bearer ")) 
            return next(new Error("invalid token"));
        
        const token = authToken.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { sub: any; };
            const pk = decoded.sub
            req.user = await User.findById(toObjectHexString(pk)) || undefined;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
);


export { decodeJWTMiddleware };