const clientsOnLine = new Map<string, ReadableStreamDefaultController>();

process.on('exit', () => {
	clientsOnLine.clear();
});

export function addOnlineClientChatMessage(
	controller: ReadableStreamDefaultController,
	uuid: string
) {
	clientsOnLine.set(uuid, controller);
	console.log('clientsOnLine: ', clientsOnLine);
}

export function isOnlineClientExists(uuid: string): boolean {
	const connectionControllers = clientsOnLine.get(uuid);
	return connectionControllers ? true : false;
}

export function removeOnlineClient(uuid: string) {
	const connectionControllers = clientsOnLine.get(uuid);
	if (connectionControllers) {
		try {
			connectionControllers.close();
		} catch (error) {
			console.error('Controller already closed:', error);
		}
	}
}

export function sendNotificationsOnline(message: string, uuid: string) {
	const connectionControllers = clientsOnLine.get(uuid);
	if (connectionControllers) {
		try {
			console.log('for each controller', connectionControllers);
			connectionControllers.enqueue(`data: ${message}\n\n`);
		} catch (error) {
			if (error instanceof Error) {
				console.error('cannot enqueue, Controller timeout or already closed:', error.message);
			} else {
				console.error('An unknown error occurred');
			}
		}
	}
}
