import { Socket } from 'socket.io';
import IUserDTO from '@src/dtos/memberDto';
import { toObjectHexString } from '@src/configs/toObjectId';
import { ICustomSocket } from '@src/types/socket/ICustomSocket';

export const handleSetupEvents = (socket: ICustomSocket): void => {
    socket.on("setup", () => {  // 채팅방 입장시,
        socket.join(socket.member._id.toString());
        socket.emit("connected");
    });
    
    socket.on("error", (error) => {
        console.error("Socket connection error:", error);
    });
  
    socket.on("disconnect", (reason) => {
        socket.leave(socket.roomId);
        console.log(`user disconnected: ${reason}`);
    });
};