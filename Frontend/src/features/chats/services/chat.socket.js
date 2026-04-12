import { io } from "socket.io-client";

export function initClient() {
  const socket = io("https://cyberflux-yyap.onrender.com", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.io server with ID:", socket.id);
  } );
  return socket;
}