
import { Server as SocketIOServer, Socket } from 'socket.io';
import IUserDocument from "@src/models/interfaces/IUser";
import { messageService } from "@services/index";
import IUserDTO from '@src/dtos/userDto';

export const handleChatEvents = (io: SocketIOServer, socket: Socket & { user: IUserDTO}): void => {
    socket.on("join chat", (room) => {  //chat id로 설정된 room에 가입
        socket.join(room._id);
        console.log(socket.user);
        if(room) socket.in(room._id).emit("user joined", room);
    });
    
    socket.on("typing", (room) => {
        socket.in(room._id).emit("typing");
    });

    socket.on("stop typing", (room) => socket.in(room._id).emit("stop typing"));
    
    socket.on("new message", async(newMessageReceived) => {
        const user = socket.user;
        const chat = newMessageReceived.chat;
        if (!chat) return console.log("chatId is not defined");
        const result = await messageService.sendMessage(newMessageReceived.content, chat, user._id.toString());
        socket.in(chat).emit("message received", result);
    });
};
