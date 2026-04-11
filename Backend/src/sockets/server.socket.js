import { Server } from "socket.io";

let io;
export function initServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  console.log("Socket.io server initialized");

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
  });


  return io;
}

export function getio(){
    if(!io){
        throw new Error("Socket.io server not initialized");    
    }

    return io;
}