// src/lib/socketServer.ts
import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

let io: Server;

export function initializeSocketServer(server: HttpServer) {
  if (!io) {
    io = new Server(server);

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('message', (data) => {
        console.log('Received message:', data);
        // Broadcast message to all other clients
        socket.broadcast.emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return io;
}
