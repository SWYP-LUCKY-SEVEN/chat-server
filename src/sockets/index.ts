import { Socket, Server } from 'socket.io';
import { handleChatEvents } from './handlers/chatHandlers';
import { handleSetupEvents } from './handlers/setupHandlers';
import http from 'http';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import { decodeJWTMiddleware } from './middlewares/authMiddleware';

dotenv.config();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

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
    console.log(`New connection: ${socket.id}`);
    next();
  });

  // JWT 해독 미들웨어
  io.engine.use(decodeJWTMiddleware);

  io.on('connection', (socket) => {
    console.log("connected to socket.io");
    handleChatEvents(io, socket);
    handleSetupEvents(socket);
  });
}