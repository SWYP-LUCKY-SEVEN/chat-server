import { Socket } from 'socket.io';

export const handleSetupEvents = (socket: Socket): void => {
    socket.on("setup", (userData) => {
        socket.join(userData?._id);
        socket.emit("connected");
    });
};