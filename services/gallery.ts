import { CarouselItemData } from "@/components/general/carousel";

export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  isForCarousel: boolean;
}

export interface GalleryData {
  masonry: GalleryItem[];
  carousel: CarouselItemData[];
}

interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiGalleryItem {
  id: number;
  documentId: string;
  imgAlt: string;
  isForCarousel: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  img: StrapiImage;
}

interface StrapiResponse {
  data: StrapiGalleryItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchGalleryImages(): Promise<GalleryData> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const apiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

  if (!apiUrl || !apiToken) {
    console.error("Strapi API URL or Token not found");
    return { masonry: [], carousel: [] };
  }

  try {
    const response = await fetch(`${apiUrl}/api/gallery-images?populate=img`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 86400 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch gallery images: ${response.statusText}`);
      return { masonry: [], carousel: [] };
    }

    const data: StrapiResponse = await response.json();

    const masonry: GalleryItem[] = [];
    const carousel: CarouselItemData[] = [];

    data.data.forEach((item) => {
        const imageUrl = item.img?.url || '';
        const title = item.imgAlt || '';
        
        // Use the large format if available, otherwise fallback to original url
        // const src = item.img?.formats?.large?.url || item.img?.url || '';
        // Strapi returns full URL if it's hosted on R2/S3/Cloudinary, or relative path if local properly configured.
        // The user provided JSON shows R2 URLs which are absolute.
        const src = imageUrl;


        if (item.isForCarousel) {
            carousel.push({
                id: item.id,
                src: src,
                title: title
            });
        } else {
            masonry.push({
                id: item.id,
                src: src,
                title: title,
                isForCarousel: false
            });
        }
    });

    return { masonry, carousel };

  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return { masonry: [], carousel: [] };
  }
}
