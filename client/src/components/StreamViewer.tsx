import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {StreamMessage} from "../model/types.ts";

export default function StreamViewer() {
  const [lines, setLines] = useState<StreamMessage[]>([]);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const socket: Socket = io("http://localhost:3001", {
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    let lastReceived = Date.now();

    socket.on("connect", () => {
      setStatus("connected");
      console.log("Connected to server");
    });

    socket.on("stream:message", (payload: StreamMessage) => {
      setLines((prev) => [...prev.slice(-199), payload]);
      lastReceived = Date.now();
    });

    socket.on("disconnect", (reason) => {
      setStatus("disconnected");
      console.warn("Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      setStatus("connection error");
      console.error("Connection error:", err.message);
    });

    // watchdog timeout
    const watchdog = setInterval(() => {
      if (Date.now() - lastReceived > 15000) {
        setStatus("stale — reconnecting...");
        socket.disconnect();
        socket.connect();
      }
    }, 5000);

    return () => {
      clearInterval(watchdog);
      socket.close();
    };
  }, []);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Stream Status: {status}</h2>
      <ul>
        {lines.map((msg, i) => (
          <li key={i}>
            [{new Date(msg.ts).toLocaleTimeString()}] {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
