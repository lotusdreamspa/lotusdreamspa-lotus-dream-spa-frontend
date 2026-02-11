import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/services/reviews';

export async function GET() {
  const reviews = await fetchGoogleReviews();
  return NextResponse.json({ reviews });
}
