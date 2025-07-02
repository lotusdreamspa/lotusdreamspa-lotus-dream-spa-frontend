// lib/strapi.ts
import qs from 'qs'; // You might need this for complex queries
//import 'server-only'; // Ensure this utility is only run on the server if using server components

// Get the Strapi API URL from environment variables
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'; // Default Strapi URL
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // If you need a token for public access

interface FetchOptions {
  populate?: string[];
  filters?: Record<string, any>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
}

export async function fetchStrapiData(
  path: string,
  options: FetchOptions = {},
  revalidate?: number // For Next.js revalidate option
) {
  const url = new URL(`${STRAPI_API_URL}/api/${path}`);

  // Build query string
  const query = qs.stringify(options, { encodeValuesOnly: true });
  url.search = query;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const response = await fetch(url.toString(), {
      headers,
      next: {
        revalidate: revalidate // Example: 60 seconds
      }
    });

    if (!response.ok) {
      console.log(response)
      console.error(`Failed to fetch data from Strapi: ${response.statusText}`);
      throw new Error(`Failed to fetch data from Strapi: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Strapi data:", error);
    throw error; // Re-throw to handle it in the component
  }
}

// Helper to get image URL
export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return null;
  }

  // Return the full URL if it's already an absolute URL
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  // Otherwise, prepend the Strapi base URL
  return `${STRAPI_API_URL}${url}`;
}