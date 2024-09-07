export async function resError(cusE: customError): Promise<Response> {
    return new Response(JSON.stringify(cusE), {
        status: 500,
        headers: {
            'Content-Type': 'application/json'
        }
    });

}