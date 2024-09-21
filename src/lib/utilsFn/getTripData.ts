export async function getTripData(tripID: string): Promise<tripPageData> {
    const resTripData = await fetch('/api/getTrip/getFullTrip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tripID: tripID
        }),
    });
    const data = (await resTripData.json()).Trip as tripPageData;
    return data;
} 