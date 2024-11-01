const clientsOnLine = new Map<string, ReadableStreamDefaultController>();

process.on('exit', () => {
	clientsOnLine.clear();
});

export function addOnlineClientChatMessage(
	controller: ReadableStreamDefaultController,
	uuid: string
) {
	if (clientsOnLine.has(uuid)) {
		const existingController = clientsOnLine.get(uuid);
		if (existingController) {
			try {
				existingController.close();
				console.log('Closed existing controller for uuid:', uuid);
			} catch (error) {
				console.error('Failed to close existing controller:', uuid);
			}
		}
	}

	// Set the new controller
	clientsOnLine.set(uuid, controller);
	// console.log('clientsOnLine: ', clientsOnLine);
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
			console.error('Controller already closed:', uuid);
		}
	}
}

export function sendNotificationsOnline(message: string, uuid: string) {
	const connectionControllers = clientsOnLine.get(uuid);
	if (connectionControllers) {
		try {
			// console.log('for each controller', connectionControllers);
			connectionControllers.enqueue(`data: ${message}\n\n`);
		} catch (error) {
			if (error instanceof Error) {
				console.error('cannot enqueue, Controller timeout or already closed:');
			} else {
				console.error('An unknown error occurred');
			}
		}
	}
}
