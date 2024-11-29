import { Socket, Server } from 'socket.io';
import { handleChatEvents } from './handlers/chatHandlers';
import { handleSetupEvents } from './handlers/setupHandlers';
import http from 'http';
import dotenv from 'dotenv';
import { decodeJWTMiddleware } from './middlewares/authMiddleware';
import { ICustomSocket } from '@src/types/socket/ICustomSocket';

dotenv.config();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
console.log(allowedOrigins)




export const initSocket = (server: http.Server): void => {
  const io = new Server(server, {
    path: '/chat/socket.io/',
    cors:{
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
      credentials: true
    }
  });

  // 로깅 미들웨어
  io.use((socket: Socket, next) => {
    console.log(`New connection: ${socket.request.headers.authorization}`);
    next();
  });

  // JWT 해독 미들웨어
  io.use((socket, next)=> {
    console.log("middle!!");
    decodeJWTMiddleware(socket as ICustomSocket, next);
  });

  io.on('connection', (socket) => {
    console.log("connected to socket.io");
    handleChatEvents(io, socket as ICustomSocket);
    handleSetupEvents(socket as ICustomSocket);
  });
}