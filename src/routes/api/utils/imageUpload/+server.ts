import type { RequestHandler } from '@sveltejs/kit';
import { uploadToProfileFolder, uploadToTripFolder } from '$lib/utils/cloudinary/cloudinaryConfig';
import { checkMissingInput, CustomError, resError } from '$lib/myAPI/customError';
import { decrypt } from '$lib/security/jwtUtils';
import { prismaMySQL } from '$lib/utils/database/sqlDB';
import { resFalse, resTrue } from '$lib/myAPI/resTrueFalse';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { base64Image, extension, id, folder } = await request.json();
		checkMissingInput(base64Image, extension, id, folder);
		const token = cookies.get('token');
		const uuid = decrypt(token as string);
		// Create a custom filename using uuid and extension
		const customFileName: string = `${id == '' ? uuid : id}`;

		// Select the correct folder
		let uploadResult;
		if (folder === 'trip') {
			const tripData = await prismaMySQL.trip.findUnique({
				where: {
					IDAccount: uuid as string,
					IDTrip: id
				}
			});
			if (tripData?.IDAccount != uuid) return resFalse();
			uploadResult = await uploadToTripFolder(
				`data:image/${extension};base64,${base64Image}`,
				customFileName
			);
			await prismaMySQL.trip.update({
				where: {
					IDTrip: id
				},
				data: {
					imageURL: uploadResult.url
				}
			});
		} else if (folder === 'profile') {
			const tripData = await prismaMySQL.account.findUnique({
				where: {
					IDAccount: uuid as string
				}
			});
			if (tripData?.IDAccount != uuid) return resFalse();
			uploadResult = await uploadToProfileFolder(
				`data:image/${extension};base64,${base64Image}`,
				customFileName
			);
			await prismaMySQL.account.update({
				where: {
					IDAccount: uuid
				},
				data: {
					imgURL: uploadResult.url
				}
			});
		} else {
			return new Response(JSON.stringify({ error: 'Invalid folder specified' }), { status: 400 });
		}

		if (!uploadResult || !uploadResult.secure_url) {
			return resFalse();
		}

		// Respond with the uploaded image URL
		// console.log(uploadResult.url)
		return new Response(JSON.stringify({ url: uploadResult.url }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('error for upload img', error);
		return resError(error as Error);
	}
};
