import Link from "next/link";



import { getStrapiMedia } from "@/lib/client-utils/media";

import { Article } from "@/types"; // Adjust the import path based on your project structure

// Define the props for this component
interface PostRendererProps {
    blogPosts: Article[];
}

export default function PostRenderer({ blogPosts }: PostRendererProps) {

    if (!blogPosts || blogPosts.length === 0) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">Nothing to see here yet, but check back soon for updates!</p>
            </div>
        );
    }

    return (
        <div id="blog" className="w-full bg-amara-dark-blue">
            <div className="w-full rounded-[20px]">
                <div className="grid grid-cols-2 xm:grid-cols-1 sm:grid-cols-1 gap-x-10">
                        {blogPosts.map((post) => {
                            const thumbnailUrl = getStrapiMedia(post.thumbnail?.formats?.thumbnail?.url || "");
                            return (
                                    <div className="w-full rounded-[30px] p-8" key={post.id}>
                                        <div
                                            className="h-96 p-2 relative rounded-lg bg-cover bg-center bg-no-repeat object-contain border-4 border-white"
                                            style={{ backgroundImage: thumbnailUrl ? `url('${thumbnailUrl}')` : 'none' }}
                                            role="img" // Indicate that this div serves as an image for accessibility
                                            aria-label={post.thumbnail?.alternativeText || post.seoTitle || "Article image"}
                                        >
                                            <Link href={`/blog/${post.slug}?documentId=${post.documentId}`}
                                                className="cursor-pointer w-full h-full flex flex-col justify-between"
                                            >
                                                <h4 className="text-[40px] xm:text-[27px] sm:text-[27px] leading-tight tracking-tight text-amara-gold font-bold bg-amara-dark-blue uppercase px-2 rounded-sm">
                                                    {post.seoTitle}
                                                </h4>
                                                <div className="flex flex-col grow justify-end">
                                                    <p className="text-[24px] xm:text-[20px] sm:text-[20px] leading-tight tracking-tighter text-amara-dark-blue bg-white px-2">
                                                        {post.seoDescription}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                            );
                        })}
                </div>
            </div>
        </div >
    );
}