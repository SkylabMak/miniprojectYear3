export async function resError(cusE: customError): Promise<Response> {
    return new Response(JSON.stringify(cusE), {
        status: 500,
        headers: {
            'Content-Type': 'application/json'
        }
    });

}

export async function resCustomError(cusE: CustomError): Promise<Response> {
    return new Response(JSON.stringify({code:cusE.code,message:cusE.message}), {
        status: 400,
        headers: {
            'Content-Type': 'application/json'
        }
    });

}

export class CustomError extends Error {
    status: number;
    code: string;

    constructor( cusE: customError) {
        super(cusE.message);
        this.status = 400;
        this.code = cusE.code.toString();
    }
}