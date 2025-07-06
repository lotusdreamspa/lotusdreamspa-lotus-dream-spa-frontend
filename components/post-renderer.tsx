// components/PostRenderer.tsx
"use client"; // This component needs to be a Client Component for Swiper and Framer Motion

import "swiper/css";
import "swiper/css/navigation"; // Make sure this is imported if you use navigation
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useScroll, useTransform, motion } from "framer-motion";
import {
    arrowLeft,
    arrowRight
} from "@/public";

import { getStrapiMedia } from "@/lib/client-utils/media";

import { Article } from "@/types"; // Adjust the import path based on your project structure

// Define the props for this component
interface PostRendererProps {
    blogPosts: Article[];
}

export default function PostRenderer({ blogPosts }: PostRendererProps) {

    const swiperRef = useRef<any | null>(null);

    const handlePrev = () => {
        if (swiperRef.current) swiperRef.current.slidePrev();
    };
    const handleNext = () => {
        if (swiperRef.current) swiperRef.current.slideNext();
    };

    if (!blogPosts || blogPosts.length === 0) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">Nothing to see here yet, but check back soon for updates!</p>
            </div>
        );
    }

    return (
        <div id="blog" className="w-full bg-amara-dark-blue py-10 padding-x">
            <div className="w-full pb-10 bg-[#9FE870] rounded-[20px]">
                <div className="p-5 overflow-hidden">
                    <Swiper
                        modules={[Navigation]}
                        loop={blogPosts.length > 1}
                        spaceBetween={30}
                        slidesPerView={1}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                        {blogPosts.map((post) => {
                            // Get the full URL for the thumbnail image
                            const thumbnailUrl = getStrapiMedia(post.thumbnail?.formats?.thumbnail?.url || "");
                            
                            return (
                                <SwiperSlide key={post.id}>
                                    <motion.div className="w-full p-16 xm:p-0 sm:p-0 flex justify-between rounded-[30px] gap-20 xm:gap-10 sm:gap-10 xm:flex-col sm:flex-col">
                                        <div
                                            className="w-1/2 h-96 relative rounded-lg bg-cover bg-center bg-no-repeat object-contain p-4"
                                            style={{ backgroundImage: thumbnailUrl ? `url('${thumbnailUrl}')` : 'none' }}
                                            role="img" // Indicate that this div serves as an image for accessibility
                                            aria-label={post.thumbnail?.alternativeText || post.seoTitle || "Article image"}
                                        >
                                            <Link href={`/blog/${post.slug}?documentId=${post.documentId}`}
                                                className="cursor-pointer mt-4 w-full h-full flex flex-col justify-between"
                                            >
                                                <h4 className="text-[40px] xm:text-[27px] sm:text-[27px] leading-tight tracking-tight text-amara-gold font-bold bg-amara-dark-blue px-4 uppercase">
                                                    {post.seoTitle}
                                                </h4>
                                                <div className="flex flex-col grow justify-end">
                                                    <p className="text-[24px] xm:text-[20px] sm:text-[20px] leading-tight tracking-tighter text-amara-dark-blue bg-white ps-4 mb-8">
                                                        {post.seoDescription}
                                                    </p>


                                                </div>
                                            </Link>
                                        </div>


                                    </motion.div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    <div className="flex w-fit gap-2 pl-10 xm:p-0 sm:p-0 xm:pt-5 sm:pt-5">
                        <div
                            onClick={handlePrev}
                            className="bg-[#FFD7EF] hover:bg-[#FFEB69] transition-all duration-200 ease-linear cursor-pointer px-3 py-2 rounded-[30px]"
                        >
                            <Image
                                src={arrowLeft}
                                alt="arrowLeft"
                                className="!w-[55px]"
                                width={55}
                                height={55}
                            />
                        </div>
                        <div
                            onClick={handleNext}
                            className="bg-[#FFD7EF] hover:bg-[#FFEB69] transition-all duration-200 ease-linear cursor-pointer px-3 py-2 rounded-[30px]"
                        >
                            <Image
                                src={arrowRight}
                                alt="arrowRight"
                                className="!w-[55px]"
                                width={55}
                                height={55}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}