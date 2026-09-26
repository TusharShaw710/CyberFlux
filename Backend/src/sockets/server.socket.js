import { Server } from "socket.io";

let io;
export function initServer(httpServer) {
  const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'https://cyber-flux.vercel.app',
    'https://cyber-flux-crmi.vercel.app'
  ].filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
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