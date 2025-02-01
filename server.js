// server.js
import express from "express";
import http from "http";
import { configDotenv } from "dotenv";
import connectToDatabase from "./database/dbConfig.js";
import logger from "./logger.js";
import path from "path";
import userRoute from "./route/userRoute.js";
import cors from "cors";
import initializeSocketServer from "./controller/socket-server.js";
configDotenv();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const server = http.createServer(app);

initializeSocketServer(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port:${process.env.PORT}`);
});

connectToDatabase();

app.use("/", userRoute);
