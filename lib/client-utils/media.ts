// utils/media.ts
// This file is SAFE for both client and server components.
// It does NOT have "use client" or "server-only" directives.

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return null;
  }

  // Return the full URL if it's already an absolute URL
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  // Otherwise, prepend the Strapi base URL from the environment variable
  return  STRAPI_API_URL + url;
}