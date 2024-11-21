
import { Server as SocketIOServer, Socket } from 'socket.io';
import { messageService } from "@services/index";
import { ICustomSocket } from '@src/types/socket/ICustomSocket';


export const handleChatEvents = (io: SocketIOServer, socket: ICustomSocket): void => {
    socket.on("join chat", (roomId) => {  //chat id로 설정된 room에 가입

        // 검증

        // 참가 시간 emit?
        socket.join(roomId);

        console.log(socket.user);


        if(roomId) socket.broadcast.to(roomId).emit("user joined", roomId);     

        socket.emit("", "");

    });
    
    socket.on("typing", (room) => {
        socket.broadcast.to(room._id).emit("typing"); 
    });

    socket.on("stop typing", (room) => socket.broadcast.to(room._id).emit("stop typing"));
    
    socket.on("new message", async(newMessageReceived) => {
        const user = socket.user;
        const chatId = newMessageReceived.chat._id;
        if (!chatId) return console.log("chatId is not defined");
        const result = await messageService.sendMessage(newMessageReceived.content, chatId, user._id.toString());
        
        socket.broadcast.to(chatId).emit("message received", result); // 자신을 제외하고 브로드캐스트
    });
};
