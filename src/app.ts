import { errorHandler, notFound } from "@middlewares/errorMiddleware";

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
import { initializeSocket } from "./sockets";

dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:3000",
  "https://shortudy.vercel.app",
];


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

const io = new Server(server, {
  path: '/chat/socket.io/',
  cors:{
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  credentials: true
}
});

initializeSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(colors.yellow(`server listening on port ${PORT}`));
});
