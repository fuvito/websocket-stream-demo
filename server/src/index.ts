import express from "express";
import http from "http";
import {Server} from "socket.io";
import type {StreamMessage} from "./model/types";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {origin: "*"},
  pingInterval: 25000,
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("worker:message", (payload: StreamMessage) => {
    io.emit("stream:message", payload);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${socket.id} (${reason})`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
