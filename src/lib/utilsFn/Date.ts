export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Format date to Thai locale in UTC
    return date.toLocaleDateString('th-TH', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
}

export function formatTime(dateString: string): string {
    const date = new Date(dateString);
    // Format time to Thai locale in UTC
    return date.toLocaleTimeString('th-TH', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
    });
}
