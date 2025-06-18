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
    arrowRight,
    collaborationCircle,
} from "@/public";
import { useTranslations } from "next-intl";

import { getStrapiMedia } from "@/lib/client-utils/media";

// Define the BlogPost interface
interface BlogPost {
    id: number;
    attributes: {
        title: string;
        description: string;
        slug: string;
        mainImage: {
            data: {
                attributes: {
                    url: string;
                    alternativeText: string | null;
                };
            } | null;
        };
    };
}

// Define the props for this component
interface PostRendererProps { // Changed interface name to PostRendererProps
    blogPosts: BlogPost[];
}

// Renamed the default export function
export default function PostRenderer({ blogPosts }: PostRendererProps) {
    const container = useRef(null);
    const t = useTranslations("ourImpactContent");
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"],
    });
    const sc = useTransform(scrollYProgress, [0, 1], [100, -1500]);

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
                <p className="text-white text-center">Nessun post del blog trovato da visualizzare.</p>
            </div>
        );
    }

    return (
        <div id="blog" className="w-full bg-amara-dark-blue py-10 padding-x">
            <div className="w-full flex justify-start items-center xm:pb-10 sm:pb-10">
                <div className="w-[72%] xm:w-full sm:w-full flex flex-col gap-4 mx-auto pb-8">
                    <h1 className="text-[80px] xm:text-[35px] sm:text-[40px] xm:leading-[40px] sm:leading-[50px] text-[#FFD7EF] font-bold leading-[80px] tracking-tighter text-center">
                        {t("ourImpactHeading2")}
                    </h1>
                </div>
            </div>

            <div className="w-full pb-10 bg-[#9FE870] rounded-[20px]">
                <div className="p-5 overflow-hidden">
                    <Swiper
                        modules={[Navigation]}
                        loop={blogPosts.length > 1}
                        spaceBetween={30}
                        slidesPerView={1}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {blogPosts.map((post) => (
                            <SwiperSlide key={post.id}>
                                <motion.div className="w-full p-14 xm:p-0 sm:p-0 flex justify-between rounded-[30px] gap-20 xm:gap-10 sm:gap-10 xm:flex-col sm:flex-col">
                                    <div className="w-1/2 xm:w-full sm:w-full flex flex-col gap-14 pt-10 xm:gap-5 sm:gap-5">
                                        {post.attributes.mainImage?.data && (
                                            <Image
                                                src={getStrapiMedia(post.attributes.mainImage.data.attributes.url) || '/placeholder.png'}
                                                alt={post.attributes.mainImage.data.attributes.alternativeText || post.attributes.title}
                                                width={100}
                                                height={100}
                                                className="w-[100px] h-[100px] object-cover rounded-full"
                                                priority={true}
                                            />
                                        )}
                                        <div className="flex flex-col gap-4">
                                            <h4 className="text-[40px] xm:text-[27px] sm:text-[27px] leading-tight tracking-tight">
                                                {post.attributes.title}
                                            </h4>
                                            <div className="flex flex-col">
                                                <p className="text-[24px] xm:text-[20px] sm:text-[20px] leading-tight tracking-tighter">
                                                    {post.attributes.description}
                                                </p>
                                                <Link
                                                    href={`/blog/${post.attributes.slug}`}
                                                    className="text-blue-600 hover:underline mt-4 inline-block font-semibold"
                                                >
                                                    Leggi di più &rarr;
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.div className="w-1/2 xm:w-full sm:w-full h-full flex items-center justify-center relative">
                                        {post.attributes.mainImage?.data && (
                                            <Image
                                                src={getStrapiMedia(post.attributes.mainImage.data.attributes.url) || '/placeholder.png'}
                                                alt={post.attributes.mainImage.data.attributes.alternativeText || post.attributes.title}
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-cover rounded-[15px]"
                                                priority={true}
                                            />
                                        )}
                                        <motion.div
                                            animate={{ rotate: [-360, 360] }}
                                            transition={{
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 20,
                                                ease: "linear",
                                            }}
                                            className="flex items-center absolute -bottom-14 right-20 xm:hidden sm:hidden"
                                        >
                                            <Image
                                                src={collaborationCircle}
                                                alt="heroCircleImg"
                                                width={120}
                                                height={120}
                                            />
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
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
                                width={55}
                                height={55}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}