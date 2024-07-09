import { errorHandler, notFound } from "@middlewares/errorMiddleware";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import path from "path";
import routes from "@routes/index";
import { useSession } from "./redis/connect-redis";

dotenv.config();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

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

export default app;