
import { Server as SocketIOServer, Socket } from 'socket.io';
import { chatService, messageService } from "@services/index";
import { toObjectId } from '@src/configs/utill';


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

        socket.emit("joined chat", reqUserId);
    });
    
    socket.on("typing", () => {
        socket.broadcast.to(socket.roomId).emit("typing"); 
    });

    socket.on("stop typing", () => socket.broadcast.to(socket.roomId).emit("stop typing"));
    
    socket.on("new message", async(message) => {
        const user = socket.user;
        const studyId = message.studyId;

        const chatId = toObjectId(studyId);
        if (!chatId) return console.log("chatId is not defined");
        const result = await messageService.sendMessage(message.content, chatId, user._id);
        
        const roomId = chatId.toHexString();

        socket.broadcast.to(roomId).emit("message received", result); // 자신을 제외하고 브로드캐스트

        socket.emit("my message", result);
    });
    
};
