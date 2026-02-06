import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import {
    NavbarElement,
    HeroElement,
    FooterElement,
} from "@/components";
import BlogPostFetcher from "@/components/fetchers/blog-post-fetcher";


export const metadata: Metadata = {
    title: "Blog & Wellness Tips | Lotus Dream SPA | Best olistic spa in Siem Reap",
    description: "Explore our blog for holistic wellness tips, the benefits of traditional massage, and news from Lotus Dream SPA, the best olistic spa in Siem Reap.",
};

// Definiamo i props che Next.js passa alle pagine
interface PageProps {
    params: { locale: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function BlogPage({ searchParams }: PageProps) {
    const t = useTranslations("blogContent");

    // 1. Estraiamo la pagina in modo sicuro. Se non c'è, è 1.
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <>
            <div className="bg-lotus-blue w-full min-h-20 flex flex-col items-center justify-center padding-x gap-10">
                <NavbarElement />
                <HeroElement title="Blog" hasSubtitle={false} />
            </div>
            <BlogPostFetcher currentPage={currentPage} key={currentPage}/>           
            <FooterElement />
        </>
    );
}