// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const requestBody = {
    my: false,
  };
  // Fetching data from an API or a local source
  const response = await fetch('/api/search/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody), // Convert the body to JSON
  });
  const data = (await response.json()).Trip;
  //   console.log('Fetched Data:', data);

  // Returning the data to the page component
  return {
    data
  };
};