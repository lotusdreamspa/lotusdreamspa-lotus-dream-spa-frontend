import type { Metadata } from "next";
import {
    NavbarElement,
    CarouselElement,
    MasonryLayoutElement,
    FooterElement
} from "@/components";

export const metadata: Metadata = {
    title: "Gallery | Lotus Dream SPA | Best olistic spa in Siem Reap",
    description: "Take a virtual tour of our tranquil sanctuary in Kandal Village. View photos of our treatment rooms and peaceful atmosphere at the best olistic spa in Siem Reap.",
};


const masonryImages = [{ id: 1, src: "/images/masonry/img-1.jpg", title: "Urban Art" },
{ id: 2, src: "/images/masonry/img-2.jpg", title: "Lotus Concept" },
{ id: 3, src: "/images/masonry/img-3.jpg", title: "Deep Blue" },
{ id: 4, src: "/images/masonry/img-4.jpg", title: "Golden Hour" },
{ id: 5, src: "/images/masonry/img-5.jpg", title: "Minimalist" },
{ id: 6, src: "/images/masonry/img-6.jpg", title: "Abstract Flow" },
{ id: 7, src: "/images/masonry/img-7.jpg", title: "Future Vision" },
{ id: 8, src: "/images/masonry/img-8.jpg", title: "Ethereal" },
{ id: 9, src: "/images/masonry/img-9.jpg", title: "Ethereal" },
{ id: 10, src: "/images/masonry/img-10.jpg", title: "Ethereal" },

]

export default function GalleryPage() {

    return (
        <>
            <div className="bg-lotus-blue w-full flex flex-col items-center justify-center padding-x gap-10">
                <NavbarElement />

            </div>
            <div className="w-full flex flex-col items-center justify-center mb-16 mt-24 lg:mt-64">


                <MasonryLayoutElement images={masonryImages}>
                    <CarouselElement
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
