import { v2 as cloudinary } from 'cloudinary';

import 'dotenv/config';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});

// const transformationOptions = {
//     width: 1024, // Resize to a maximum width of 1024px (you can adjust as needed)
//     height: 1024, // Resize to a maximum height of 1024px (you can adjust as needed)
//     quality: "auto:best", // Auto-adjust the quality to maintain the best quality while reducing file size
//     fetch_format: "auto" // Convert to the best format for the requesting browser
// };

export const uploadToTripFolder = async (fileData: string, customFileName: string) => {
	try {
		const result = await cloudinary.uploader.upload(fileData, {
			folder: 'miniproject/trip',
			public_id: customFileName, // Set custom file name
			overwrite: true
			// transformation: transformationOptions
		});
		return result;
	} catch (error) {
		console.log('error to uploadToProfileFolder', error);
		throw error;
	}
};

// Function to upload an image to "miniproject/profile" with a custom name
export const uploadToProfileFolder = async (fileData: string, customFileName: string) => {
	try {
		const result = await cloudinary.uploader.upload(fileData, {
			folder: 'miniproject/profile',
			public_id: customFileName, // Set custom file name
			overwrite: true
			// transformation: transformationOptions
		});
		return result;
	} catch (error) {
		console.log('error to uploadToProfileFolder', error);
		throw error;
	}
};

export const uploadToProfileFolderWithURL = async (imageUrl: string, customFileName: string) => {
	try {
		const result = await cloudinary.uploader.upload(imageUrl, {
			folder: 'miniproject/profile',
			public_id: customFileName, // Set custom file name
			overwrite: true
		});
		return result;
	} catch (error) {
		console.log('Error uploading to Profile Folder:', error);
		throw error;
	}
};
