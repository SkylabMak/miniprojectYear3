export function resizeImageTo64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			const img = new Image();
			img.src = e.target?.result as string;

			img.onload = () => {
				const canvas = document.createElement('canvas');
				const maxSize = 1024; // Max size (width or height)

				let width = img.width;
				let height = img.height;

				// Calculate new dimensions while maintaining aspect ratio
				if (width > height) {
					if (width > maxSize) {
						height *= maxSize / width;
						width = maxSize;
						console.log(width, ' ', height);
					}
				} else {
					if (height > maxSize) {
						width *= maxSize / height;
						height = maxSize;
						console.log(width, ' ', height);
					}
				}

				// Set canvas dimensions
				canvas.width = width;
				canvas.height = height;

				// Draw the image on the canvas
				const ctx = canvas.getContext('2d');
				ctx?.drawImage(img, 0, 0, width, height);

				// Get the resized image as Base64
				const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8); // Compress to 80% quality
				resolve(resizedBase64.split(',')[1]); // Remove the data URL prefix
			};

			img.onerror = (error) => {
				reject(error);
			};
		};

		reader.onerror = (error) => {
			reject(error);
		};

		reader.readAsDataURL(file); // Load the image file
	});
}
