// // // src/hooks.server.ts
// // import type { Handle } from '@sveltejs/kit';
// // import { WebSocketServer, WebSocket } from 'ws'; // Import WebSocket from `ws`
// // import type { IncomingMessage } from 'http';

// // const onlineUsers = new Map<string, WebSocket>(); // Track online users by userId and WebSocket connection
// // const wss = new WebSocketServer({ noServer: true }); // Initialize WebSocket server

// // // Handle new WebSocket connections
// // wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
// //     const userId = new URL(request.url!, `http://${request.headers.host}`).searchParams.get('userId');
// //     console.log('New WebSocket connection for userId:', userId);

// //     if (userId) {
// //         onlineUsers.set(userId, ws); // Add the connection to onlineUsers

// //         ws.on('close', () => {
// //             onlineUsers.delete(userId); // Remove from onlineUsers on disconnect
// //         });
// //     }
// // });

// // // Retrieve WebSocket connection for a given userId
// // export function getOnlineUserSocket(userId: string): WebSocket | undefined {
// //     return onlineUsers.get(userId);
// // }

// // // Handle HTTP -> WebSocket upgrade
// // export function handleWebSocketUpgrade(request: IncomingMessage, socket: any, head: Buffer) {
// //     wss.handleUpgrade(request, socket, head, (ws) => {
// //         wss.emit('connection', ws, request);
// //     });
// // }

// // // Export the WebSocket server and online users map
// // export { wss, onlineUsers };

// // export const handle: Handle = async ({ event, resolve }) => {
// //     const { request } = event;
// //     console.log("serverHooke ",request.headers)
// //     console.log("Server Hook - Request received:");
// //     console.log("URL:", request.url);
// //     console.log("Headers:", Array.from(request.headers.entries()));
// //     // Check if the request is a WebSocket upgrade request
// //     if (request.headers.get('upgrade') === 'websocket') {
// //         console.log("serverHooke websocket")
// //         const rawRequest = request as any; // Casting to access the raw properties

// //         return new Promise((resolve) => {
// //             handleWebSocketUpgrade(rawRequest, rawRequest.socket, Buffer.alloc(0));
// //         });
// //     }

// //     return resolve(event); // Process non-WebSocket requests normally
// // };

// // src/hooks.server.ts
// import { initializeSocketServer } from '$lib/utils/webSocket/socketServer';
// import type { Handle } from '@sveltejs/kit';

// export const handle: Handle = async ({ event, resolve }) => {
//   const response = await resolve(event);

//   // Pass the HTTP server to Socket.IO when the server starts
//   initializeSocketServer(event.locals.server);

//   return response;
// };
