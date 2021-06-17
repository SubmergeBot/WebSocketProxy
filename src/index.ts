import WebSocket, { Server } from "ws";
import { Message } from "./messages";

const server = new Server({ port: parseInt(process.env.PORT || "5000") });

var masterSocket: WebSocket | undefined;
var slaveSockets: Map<string, WebSocket> = new Map();

server.on("connection", (socket) => {
  let isAlive = true;
  let role: "master" | "slave";
  let id: string;

  const heartbeat = setInterval(() => {
    socket.ping();
    isAlive = false;

    setTimeout(() => {
      if (!isAlive) socket.terminate();
    }, 1000);
  }, 30000);

  socket.on("pong", () => (isAlive = true));
  socket.on("close", () => {
    if (role === "master") masterSocket = undefined;
    if (role === "slave") slaveSockets.delete(id);
    clearTimeout(heartbeat);
  });

  socket.on("message", (rawData) => {
    const data: Message = JSON.parse(rawData.toString());
    if (data.type === 0 && data.from === "master") {
      if (masterSocket) return socket.close(4001, "Master already registered");
      role = "master";
      masterSocket = socket;
    } else if (data.type === 0 && data.from === "slave" && data.id) {
      id = data.id;
      role = "slave";
      slaveSockets.set(id, socket);
    } else if (role === "slave" && data.id) {
      masterSocket?.send(data);
    } else if (role === "master" && data.id) {
      const socket = slaveSockets.get(data.id);
      socket?.send(rawData);
    } else {
      socket.close(4000, "Invalid data");
    }
  });
});
