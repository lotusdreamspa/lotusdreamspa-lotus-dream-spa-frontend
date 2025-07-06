// lib/strapi.ts (Example - you might need to adapt this to your existing fetchStrapiData structure)

import qs from 'qs'; // You'll need to install 'qs': npm install qs

const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const API_MENU_URL = process.env.NEXT_PUBLIC_STRAPI_CASHIER_API_URL || 'http://localhost:1337';

export async function fetchStrapiData<T>(
  path: string,
  urlParamsObject: any = {},
  revalidate: number = 300
): Promise<T | null> {
  try {
    // Stringify the query parameters using qs for correct Strapi deep population
    const queryString = qs.stringify(urlParamsObject, {
      encodeValuesOnly: true, // Only encode values, not keys
      arrayFormat: 'brackets', // Use brackets for array format: populate[0], populate[1]
      addQueryPrefix: true, // Add '?' at the beginning if needed
    });

    const requestUrl = `${API_BASE_URL}/api/${path}${queryString}`;

    console.log(`Fetching from Strapi: ${requestUrl}`); // Log the actual URL being used

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: revalidate,
      },
    });

    if (!response.ok) {
      console.log(response); // Log the full response object for more details
      console.error(`Failed to fetch data from Strapi: ${response.statusText}`);
      const errorBody = await response.text(); // Get response body for more error info
      console.error('Strapi Error Body:', errorBody);
      throw new Error(`Failed to fetch data from Strapi: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error fetching Strapi data:', error);
    return null;
  }
}

export async function fetchMenuData<T>(
  path: string,
  urlParamsObject: any = {},
  revalidate: number = 300
): Promise<T | null> {
  try {
    // Stringify the query parameters using qs for correct Strapi deep population
    const queryString = qs.stringify(urlParamsObject, {
      encodeValuesOnly: true, // Only encode values, not keys
      arrayFormat: 'brackets', // Use brackets for array format: populate[0], populate[1]
      addQueryPrefix: true, // Add '?' at the beginning if needed
    });

    const requestUrl = `${API_MENU_URL}/api/${path}${queryString}`;

    console.log(`Fetching from Strapi: ${requestUrl}`); // Log the actual URL being used

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: revalidate,
      },
    });

    if (!response.ok) {
      console.log(response); // Log the full response object for more details
      console.error(`Failed to fetch data from Strapi: ${response.statusText}`);
      const errorBody = await response.text(); // Get response body for more error info
      console.error('Strapi Error Body:', errorBody);
      throw new Error(`Failed to fetch data from Strapi: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error fetching Strapi data:', error);
    return null;
  }
}