
import { Server as SocketIOServer, Socket } from 'socket.io';
import { chatService, messageService } from "@services/index";
import { toObjectId } from '@src/configs/toObjectId';


export const handleChatEvents = (io: SocketIOServer, socket: Socket): void => {
    socket.on("join chat", (studyId) => {  //chat id로 설정된 room에 가입

        const reqUserId = socket.user._id;
        const chatId = toObjectId(studyId); 
        // 검증

        chatService.isRoomAuth(chatId, reqUserId);

        const roomId = chatId.toHexString();
        // 참가 시간 emit?
        socket.join(roomId);
        socket.roomId = roomId;

        console.log(socket.user);


        if(roomId) socket.broadcast.to(roomId).emit("user joined", roomId);     

        socket.emit("", "");

    });
    
    socket.on("typing", () => {
        socket.broadcast.to(socket.roomId).emit("typing"); 
    });

    socket.on("stop typing", () => socket.broadcast.to(socket.roomId).emit("stop typing"));
    
    socket.on("new message", async(newMessageReceived) => {
        const user = socket.user;
        const chatId = newMessageReceived.chat._id;
        if (!chatId) return console.log("chatId is not defined");
        const result = await messageService.sendMessage(newMessageReceived.content, chatId, user._id);
        
        socket.broadcast.to(chatId).emit("message received", result); // 자신을 제외하고 브로드캐스트
    });
};
