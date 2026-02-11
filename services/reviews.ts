// services/reviews.ts

export type GoogleReview = {
  rating: number;
  date: string;
  source: string;
  snippet: string;
  link: string;
  userData?: {
    name: string;
    imageUrl: string;
    link: string;
  }
};

export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY;

  if (!apiKey) {
    console.error("API Key not found for Google Reviews");
    return [];
  }

  const requestBody = {
    "cid": process.env.NEXT_PUBLIC_GOOGLE_CID,
    "fid": process.env.NEXT_PUBLIC_GOOGLE_FID,
    "placeId": process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID,
    "sortBy": "newest" // Optional, as requested
  };

  try {
    const response = await fetch('https://google.serper.dev/reviews', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
        console.error(`Failed to fetch reviews: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.reviews || [];

  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return [];
  }
}
