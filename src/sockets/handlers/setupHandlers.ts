import { toNumber, toObjectId } from '@src/configs/utill';
import { getUserWithNumberId } from '@src/dtos/userResponse';
import { Socket } from 'socket.io';

export const handleSetupEvents = (socket: Socket): void => {
    socket.on("setup", () => {  // 채팅방 입장시,
        socket.join(socket.user._id.toString());
        socket.emit("connected");
    });
    
    socket.on("error", (error) => {
        console.error("Socket connection error:", error);
    });
  
    socket.on("disconnect", (reason) => {
        socket.leave(socket.roomId);

        socket.broadcast.to(socket.roomId).emit("user leave",
            getUserWithNumberId(socket.user)); // 자신을 제외하고 브로드캐스트

        console.log(`user disconnected: ${reason}`);
    });
};