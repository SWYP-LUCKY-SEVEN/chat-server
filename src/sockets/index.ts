import { Socket, Server as SocketIOServer } from 'socket.io';
import { handleChatEvents } from './handlers/chatHandlers';
import { handleSetupEvents } from './handlers/setupHandlers';

export const initializeSocket = (io: SocketIOServer): void => {
  io.on('connection', (socket) => {
    console.log("connected to socket.io");

    handleChatEvents(io, socket);
    handleSetupEvents(socket);

    socket.on("error", (error) => {
      console.error("Socket connection error:", error);
    });
  
    socket.on("disconnect", (reason) => {
      console.log(`user disconnected: ${reason}`);
    });
  });
};