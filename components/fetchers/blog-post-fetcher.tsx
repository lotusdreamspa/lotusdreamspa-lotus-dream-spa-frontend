import { fetchStrapiData } from "@/lib/strapi";
import PostRenderer from "@/components/renderers/post-renderer"; 
import Paginator from "@/components/general/paginator"; 
import { Article, StrapiResponse } from '@/types';

export default async function BlogPostFetcher({ 
    currentPage = 1 ,
    key = 0
}: { 
    currentPage?: number ,
    key?: number
}) {
    let blogPosts: Article[] = [];
    let pagination = null;

    try {
        const response = await fetchStrapiData('articles', {
            populate: ['thumbnail'], // Assicurati che 'thumbnail' sia il nome giusto in Strapi
            pagination: {
                page: currentPage,
                pageSize: 2, // Rimetti un numero realistico (es. 6 o 9)
            },
            sort: ['publishedAt:desc'],
        }, 3600); // Cache 1 ora

        const typedResponse = response as StrapiResponse<Article[]>;
        blogPosts = typedResponse.data || [];
        pagination = typedResponse.meta?.pagination || null;

    } catch (err) {
        console.error("Fetch error:", err);
        return <div className="text-white text-center py-10">Error loading posts.</div>;
    }

    if (blogPosts.length === 0) {
        return (
             <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">No blog posts found.</p>
            </div>
        );
    }

    return (
        <div className="bg-amara-dark-blue flex flex-col gap-10 w-full pb-20">
            {/* Passiamo solo i post al Renderer */}
            <PostRenderer blogPosts={blogPosts} />
            
            {/* Il Paginator sta qui, sotto i post */}
            {pagination && <Paginator pagination={pagination} />}
        </div>
    );
}