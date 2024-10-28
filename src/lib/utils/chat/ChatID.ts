// Map to track online users by their userId and WebSocket connectio
export function getChatID(idAccount: string, idTrip: string) {
	return `${idAccount}-${idTrip}`;
}
