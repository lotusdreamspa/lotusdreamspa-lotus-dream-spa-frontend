import { useTranslations } from "next-intl";
import {
    NavbarElement,
    HeroElement,
    FooterElement,
} from "@/components";
import BlogPostFetcher from "@/components/fetchers/blog-post-fetcher";

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