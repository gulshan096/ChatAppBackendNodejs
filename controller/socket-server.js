import { Server } from "socket.io";
import User from "../model/userModel.js";
import Chat from "../model/chatModel.js";

import logger from "../logger.js";
// import CONST from "../constant.js";
// import commonHelper from "../commonHelper.js";
import { saveChat } from "./userController.js";

export default function initializeSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.auth.userId;

    console.log(`User connected: ${userId}`);

    await User.findByIdAndUpdate(userId, {
      $set: { is_online: "1" },
    });

    // online status
    socket.broadcast.emit("getOnlineUser", { user_id: userId });

    socket.on("sendMessage", (payload) => {
      saveChat(payload, socket);
    });

    //Distance chat
    socket.on("newChat", (data) => {
      socket.broadcast.emit("loadNewChat", data);
    });

    // load Old Chats
    socket.on("existChat", async (data) => {

      console.log(data);

      var chats = await Chat.find({
        $or: [
          { sender_id: data.sender_id, receiver_id: data.receiver_id },
          { sender_id: data.receiver_id, receiver_id: data.sender_id },
        ],
      });

      // console.log(chats);


      socket.emit("loadOldChats", chats);
    });

    socket.on("disconnect", async () => {
      console.log("user disconnected:", userId);

      await User.findByIdAndUpdate(userId, { $set: { is_online: "0" } });

      // offline status
      socket.broadcast.emit("getOfflineUser", { user_id: userId });
    });
  });
}
