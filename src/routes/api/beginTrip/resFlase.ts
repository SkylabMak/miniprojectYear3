export async function resFalse() {
    return new Response(JSON.stringify({ success: false }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
