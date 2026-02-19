import type { Metadata } from "next";
import {
    NavbarElement,
    CarouselElement,
    MasonryLayoutElement,
    FooterElement
} from "@/components";
import { fetchGalleryImages } from "@/services/gallery";

export const metadata: Metadata = {
    title: "Gallery | Lotus Dream SPA | Best olistic spa in Siem Reap",
    description: "Take a virtual tour of our tranquil sanctuary in Kandal Village. View photos of our treatment rooms and peaceful atmosphere at the best olistic spa in Siem Reap.",
};

export default async function GalleryPage() {
    const { masonry, carousel } = await fetchGalleryImages();


    console.log(masonry, carousel)
    return (
        <>
            <div className="bg-lotus-blue w-full flex flex-col items-center justify-center padding-x gap-10">
                <NavbarElement />
            </div>
            <div className="w-full flex flex-col items-center justify-center mb-16 mt-24 lg:mt-64">
                <MasonryLayoutElement images={masonry}>
                    <CarouselElement
                        items={carousel}
                        autoplay={true}
                        autoplayDelay={3000}
                        loop={true}
                    />
                </MasonryLayoutElement>
            </div>
            <FooterElement />
        </>
    );
}
