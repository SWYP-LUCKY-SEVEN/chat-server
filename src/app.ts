import { errorHandler, notFound } from "@middlewares/errorMiddleware";

import IUserDocument from "./dtos/userDto";
import { Server } from "socket.io";
import colors from "colors";
import connectDB from "@configs/db";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import path from "path";
import routes from "@routes/index";
import { useSession } from "./redis/connect-redis";

dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:3000",
  "https://shortudy.vercel.app",
];

const io = new Server(server, {
  path: '/chat/socket.io/',
  cors:{
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  credentials: true
}
});
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  credentials: true
}));

app.use("/api", routes);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "prod") {
  app.use(express.static(path.join(__dirname1, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json("dev API server is running");
  });
}
app.use(notFound);
app.use(errorHandler);
app.use(useSession)

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("error", (error) => {
    console.error("Socket connection error:", error);
  });

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

  socket.on("disconnect", (reason) => {
    console.log(`user disconnected: ${reason}`);
  });

});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(colors.yellow(`server listening on port ${PORT}`));
});
