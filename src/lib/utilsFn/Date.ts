export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	if (dateString == '') return 'no date';
	// Format date to Thai locale in UTC
	return date.toLocaleDateString('th-TH', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric'
	});
}

export function formatTime(dateString: string): string {
	const date = new Date(dateString);
	if (dateString == '') return 'no time';
	return date.toLocaleTimeString('th-TH', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false // Use 24-hour format
	});
}
