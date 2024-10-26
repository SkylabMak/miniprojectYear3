const clients = new Map<string, Map<string, ReadableStreamDefaultController>>();

process.on('exit', () => {
    clients.clear();
});

export function addClientChatMessage(connectionId: string, controller: ReadableStreamDefaultController, uuid : string) {
    if (!clients.has(connectionId)) {
        clients.set(connectionId, new Map([[uuid, controller]]));
    } else {
        const connectionControllers = clients.get(connectionId);
        if (connectionControllers && !connectionControllers.has(uuid)) {
            connectionControllers.set(uuid, controller);
        }
    }
    console.log("clients: ", clients);
}

export function removeClient(connectionId: string, uuid: string) {
    const connectionControllers = clients.get(connectionId);
    if (connectionControllers) {
        const controller = connectionControllers.get(uuid);
        if (controller) {
            try {
                controller.close();
            } catch (error) {
                console.error("Controller already closed:", error);
            }
            connectionControllers.delete(uuid);
        }

        // Remove the outer map entry if there are no controllers left
        if (connectionControllers.size === 0) {
            clients.delete(connectionId);
        }
    }
}

export function broadcastChatMessage(message: string, connectionId: string) {
    const connectionControllers = clients.get(connectionId);
    if (connectionControllers) {
        connectionControllers.forEach(controller => {
            console.log("for each controller",controller)
            controller.enqueue(`data: ${message}\n\n`);
        });
    }
}
