
import { Server as SocketIOServer, Socket } from 'socket.io';
import IUserDocument from "@src/models/interfaces/IUser";

export const handleChatEvents = (io: SocketIOServer, socket: Socket): void => {
    socket.on("join chat", (room) => {
        socket.join(room._id);
        if(room) socket.in(room._id).emit("user joined", room);
    });
    
    socket.on("typing", (room) => {
        socket.in(room._id).emit("typing");
    });
    socket.on("stop typing", (room) => socket.in(room._id).emit("stop typing"));
    
    socket.on("new message", (newMessageReceived) => {
        let chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat user not defined");
        chat.users.forEach((user: IUserDocument) => {
            if (user._id == newMessageReceived.sender._id) return;
            else {
                socket.in(chat.id).emit("message received", newMessageReceived);
            }
        });
    });
};
