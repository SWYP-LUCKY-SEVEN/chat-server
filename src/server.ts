import app from "./app";
import connectDB from "./configs/db";
import http from 'http';
import colors from 'colors';
import { initSocket } from "./sockets";

connectDB();

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(colors.yellow(`server listening on port ${PORT}`));
});