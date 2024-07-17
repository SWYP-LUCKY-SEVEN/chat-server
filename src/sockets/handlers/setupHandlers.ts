import { Socket } from 'socket.io';

export const handleSetupEvents = (socket: Socket): void => {
    socket.on("setup", (userData) => {  //? 아직 의문 개인 챗으로 예상됨.
        socket.join(userData?._id);
        socket.emit("connected");
    });
    
    socket.on("error", (error) => {
        console.error("Socket connection error:", error);
    });
  
    socket.on("disconnect", (reason) => {
        console.log(`user disconnected: ${reason}`);
    });
};