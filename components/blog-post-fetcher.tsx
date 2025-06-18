import { fetchStrapiData } from "@/lib/strapi"; // Assicurati che il percorso sia corretto
import PostRender from "@/components/post-renderer"; // Assicurati che il percorso sia corretto

// Definisci il tipo per i tuoi blog post (lo stesso usato in Collaboration)
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
                    alternativeText: string;
                };
            };
        };
        // Aggiungi altri campi che ti servono
    };
}

export default async function BlogPostFetcher() {
    let blogPosts: BlogPost[] = [];
    let error: string | null = null;

    try {
        const data = await fetchStrapiData('blog-posts', {
            populate: ['mainImage'],
            sort: ['createdAt:desc'],
            pagination: {
                limit: 10,
            }
        }, 60); // Revalidate ogni 60 secondi
        blogPosts = data.data;
    } catch (err) {
        error = "Failed to load blog posts.";
        console.error(err);
    }

    if (error) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-red-500 text-center">{error}</p>
            </div>
        );
    }

    if (blogPosts.length === 0) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">No blog posts found.</p>
            </div>
        );
    }

   
    return <PostRender blogPosts={blogPosts} />;
}