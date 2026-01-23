import Link from "next/link";
import Image from "next/image"; 
import { getStrapiMedia } from "@/lib/client-utils/media";
import { Article } from "@/types";

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
        <div id="blog" className="w-full">
            <div className="w-full">
                <div className="grid grid-cols-2 xm:grid-cols-1 sm:grid-cols-1 gap-x-4">
                    {blogPosts.map((post) => {
                        const thumbnailUrl = getStrapiMedia(post.thumbnail?.formats?.thumbnail?.url || "");
                        const altText = post.thumbnail?.alternativeText || post.seoTitle || "Article image";

                        return (
                            <div className="w-full p-4" key={post.id}>
                                <div className="h-96 relative rounded-md border-4 border-white overflow-hidden group">
                                    
                                    {/* Immagine di sfondo */}
                                    {thumbnailUrl ? (
                                        <Image 
                                            src={thumbnailUrl}
                                            alt={altText}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover z-0"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-800 z-0" />
                                    )}

                                    {/* Contenuto */}
                                    <Link 
                                        href={`/blog/${post.slug}`}
                                        className="cursor-pointer w-full h-full flex flex-col justify-between relative z-10"
                                    >
                                        {/* --- TITOLO --- */}
                                        {/* WRAPPER: Gestisce Sfondo e Padding */}
                                        <div className="self-start bg-lotus-dark-blue/70 backdrop-blur-sm rounded-sm px-4 py-2">
                                            {/* TESTO: Gestisce il Clamp puro */}
                                            <h4 className="text-xl xm:text-md sm:text-md leading-loose text-white font-bold font-agr uppercase line-clamp-2">
                                                {post.seoTitle}
                                            </h4>
                                        </div>
                                        
                                        {/* --- DESCRIZIONE --- */}
                                        <div className="flex flex-col grow justify-end items-start">
                                            {/* WRAPPER: Gestisce Sfondo e Padding */}
                                            {/* Ho ridotto pb-4 a p-2 per bilanciare, regola tu se vuoi più spazio */}
                                            <div className="bg-lotus-dark-blue/70 backdrop-blur-sm rounded-sm px-2 py-2">
                                                {/* TESTO: Gestisce il Clamp puro */}
                                                <p className="text-2xl xm:text-xl sm:text-xl tracking-tighter text-lotus-bronze line-clamp-2">
                                                    {post.seoDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}