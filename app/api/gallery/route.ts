import { NextResponse } from 'next/server';
import { fetchGalleryImages } from '@/services/gallery';

export async function GET() {
  const galleryData = await fetchGalleryImages();
  return NextResponse.json(galleryData);
}
