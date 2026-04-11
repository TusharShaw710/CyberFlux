import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import { createServer } from 'http';
import { initServer } from './src/sockets/server.socket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
initServer(httpServer);

// Connect to MongoDB
connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server is listening...`);
});
