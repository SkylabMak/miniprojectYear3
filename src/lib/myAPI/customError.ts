import { MISSING_INPUT } from "$lib/constants/errorCodes";

export async function resError(cusE: customError): Promise<Response> {
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
        return resCustomError(error as CustomError)
    }
    else {
        throw error
    }
}

export function checkMissingInput(...params: any[]) {
    if (params.some(val => val === null || val === undefined)) {
        throw new CustomError(MISSING_INPUT)
    }
}