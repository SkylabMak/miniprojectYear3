import { MISSING_INPUT } from '$lib/constants/errorCodes';

export async function resCustomErrorCode(cusE: customError): Promise<Response> {
	return new Response(JSON.stringify(cusE), {
		status: 500,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function resError(cusE: Error): Promise<Response> {
	return new Response(JSON.stringify(cusE), {
		status: 500,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function resCustomError(cusE: CustomError): Promise<Response> {
	return new Response(JSON.stringify({ code: cusE.code, message: cusE.message }), {
		status: 400,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export class CustomError extends Error {
	status: number;
	code: string;

	constructor(cusE: customError) {
		super(cusE.message);
		this.status = 400;
		this.code = cusE.code.toString();
	}
}

export async function checkErrorAndRes(error: any) {
	if (error instanceof CustomError) {
		if (error.code !== '501') {
			console.log(error);
		}
		return resCustomError(error as CustomError);
	} else {
		throw error;
	}
}

export function checkMissingInput(...params: any[]) {
	params.forEach((val, index) => {
		if (val === null || val === undefined) {
			console.error(`Missing input at position ${index + 1}`);
			throw new CustomError(MISSING_INPUT);
		}
	});
}
