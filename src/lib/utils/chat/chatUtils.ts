const clientsFocus = new Map<string, Map<string, ReadableStreamDefaultController>>();

process.on('exit', () => {
	clientsFocus.clear();
});

export function addClientChatMessage(
	connectionId: string,
	controller: ReadableStreamDefaultController,
	uuid: string
) {
	if (!clientsFocus.has(connectionId)) {
		clientsFocus.set(connectionId, new Map([[uuid, controller]]));
	} else {
		const connectionControllers = clientsFocus.get(connectionId);
		if (connectionControllers) {
			if (connectionControllers.has(uuid)) {
				// Close the existing controller before setting the new one
				const existingController = connectionControllers.get(uuid);
				if (existingController) {
					try {
						existingController.close();
						console.log('close : ', existingController);
					} catch (error) {
						console.error('Failed to close existing controller:', uuid);
					}
				}
			}
			connectionControllers.set(uuid, controller); // Set the new controller
		}
	}
	console.log('clients: ', clientsFocus);
}

export function isClientExists(connectionId: string, uuid: string): boolean {
	const connectionControllers = clientsFocus.get(connectionId);
	return connectionControllers ? connectionControllers.has(uuid) : false;
}

export function removeClient(connectionId: string, uuid: string) {
	console.log('some user want to close');
	const connectionControllers = clientsFocus.get(connectionId);
	if (connectionControllers) {
		const controller = connectionControllers.get(uuid);
		if (controller) {
			try {
				controller.close();
			} catch (error) {
				console.error('Controller already closed:', uuid);
			}
			connectionControllers.delete(uuid);
		}

		// Remove the outer map entry if there are no controllers left
		if (connectionControllers.size === 0) {
			clientsFocus.delete(connectionId);
		}
	}
	console.log('clients: ', clientsFocus);
}

export function broadcastChatMessage(message: string, connectionId: string) {
	const connectionControllers = clientsFocus.get(connectionId);
	if (connectionControllers) {
		connectionControllers.forEach((controller) => {
			try {
				console.log('for each controller', controller);
				controller.enqueue(`data: ${message}\n\n`);
			} catch (error) {
				if (error instanceof Error) {
					console.error('cannot enqueue, Controller timeout or already closed:');
				} else {
					console.error('An unknown error occurred');
				}
			}
		});
	}
}
