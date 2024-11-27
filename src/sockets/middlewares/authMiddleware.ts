import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import User from "@models/userModel";
import { toObjectId } from "@src/configs/toObjectId";
import IUserDTO from '@src/dtos/userDto';

const JWT_SECRET = process.env.JWT_SECRET as string;

const decodeJWTMiddleware = (socket: Socket, next: (err?: any) => void) => {
    const authToken = socket.handshake?.auth.token;
        
    if (!authToken) {
        console.log("no token");
        return next(new Error("no token"));
    }
    
    let token = authToken;
    
    if (authToken.startsWith("Bearer ")){ 
      token = authToken.substring(7);
    }
    

    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
        if (err) {
          console.error("Error decoding token:", err);
          return next(new Error("Not authorized, token invalid"));
        }
        try {
          const userId = decoded.sub;
          const user = await User.findById(toObjectId(userId));
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