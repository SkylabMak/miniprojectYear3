// plugin.ts
import { WebSocketServer } from 'ws';
import type http from 'node:http';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
	ws.on('message', (data) => {
		console.log('received: %s', data);
	});
});

export default function plugin(server: http.Server) {
	server.on('upgrade', function (req, socket, head) {
		if (req.url === '/') {
			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit('connection', ws, req);
			});
		} else {
			socket.destroy();
		}
	});
}