import {io} from "socket.io-client";
import type {StreamMessage} from "./model/types";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";
const socket = io(SERVER_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 3000,
});

socket.on("connect", () => {
  console.log("Worker connected:", socket.id);
});

function randomText(): string {
  const words = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf"];
  return Array.from({ length: Math.ceil(Math.random() * 6) }, () =>
    words[Math.floor(Math.random() * words.length)]
  ).join(" ");
}

setInterval(() => {
  const payload: StreamMessage = { text: randomText(), ts: Date.now() };
  socket.emit("worker:message", payload);
}, 1000);

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("Disconnected:", reason);
});
