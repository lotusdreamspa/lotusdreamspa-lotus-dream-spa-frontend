// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchStrapiData } from '@/lib/strapi';

// Import all the provided types
import {
    Article as StrapiArticleType,
    ArticleData,
    Image as ImageType, // Renamed to avoid conflict with Next.js Image component
    ContentBlock,
    ParagraphBlock,
    HeroBlock,
    QuoteBlock,
    CtaBlock,
    GalleryBlock,
} from '@/types';

import { Metadata } from 'next';

interface StrapiSingleResponse<T> {
    data: T | null;
    meta: any;
}

export async function generateStaticParams() {
    console.log('Running generateStaticParams for blog detail pages...');
    const articlesRes: ArticleData | null = await fetchStrapiData('articles?fields=slug');

    if (!articlesRes || !articlesRes.data) {
        console.warn('No articles found for generateStaticParams.');
        return [];
    }

    return articlesRes.data.map((article) => ({
        slug: article.slug,
    }));
}

async function getArticleForMetadata(slug: string, documentId: string): Promise<StrapiArticleType | null> {
    if (!documentId) {
        console.error(`Error: documentId is missing for metadata generation for slug: ${slug}`);
        return null;
    }

    const articleRes: StrapiSingleResponse<StrapiArticleType> | null = await fetchStrapiData(
        `articles/${documentId}`,
        {
            populate: ['openGraphImage'], // Popola solo l'immagine per OpenGraph e gli altri campi SEO
        }, 300
    );

    if (!articleRes || !articleRes.data) {
        console.error(`Article not found or API error for metadata for documentId: ${documentId}`);
        return null;
    }
    return articleRes.data;
}


// --- INIZIO: generateMetadata ---
export async function generateMetadata({
    params,
    searchParams,
}: {
    params: {
        locale: string; slug: string 
};
    searchParams: { documentId?: string };
}): Promise<Metadata> {
    const { slug } = params;
    const { documentId } = searchParams;

    // Recupera i dati dell'articolo per i metadata
    const article = await getArticleForMetadata(slug, documentId as string); // documentId è garantito da notFound() sotto

    if (!article) {
        // Se l'articolo non viene trovato, puoi restituire metadata generici o NotFound
        return {
            title: "Article Not Found",
            description: "The requested article could not be found.",
        };
    }

    // Costruisci l'URL completo dell'immagine per Open Graph
    const ogImageUrl = article.openGraphImage && article.openGraphImage.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${article.openGraphImage.formats.small.url}`
        : null;

    return {
        // Usa seoTitle se disponibile, altrimenti fallback al titolo dell'articolo
        title: article.seoTitle || article.title,
        // Usa seoDescription se disponibile, altrimenti fallback alla descrizione dell'articolo
        description: article.seoDescription || article.description,
        openGraph: {
            // Se openGraphTitle non è fornito, usa seoTitle o title
            title: article.openGraphTitle || article.seoTitle || article.title,
            // Se openGraphDescription non è fornito, usa seoDescription o description
            description: article.openGraphDescription || article.seoDescription || article.description,
            // Se hai un tipo per l'Open Graph (es. 'article', 'website')
            type: 'article', // O 'website' a seconda del contenuto
            // URL dell'immagine di Open Graph
            images: ogImageUrl ? [{ url: ogImageUrl }] : [],
            // URL canonico della pagina
            url: `https://amara.pub/${params.locale}/blog/${slug}?documentId=${documentId}`, 
            // Assicurati di usare il tuo dominio reale
        },
        twitter: {
            // Se twitterTitle non è fornito, usa seoTitle o title
            title: article.openGraphTitle || article.openGraphTitle || article.title,
            // Se twitterDescription non è fornito, usa seoDescription o description
            description: article.openGraphDescription || article.openGraphDescription || article.description,
            // URL dell'immagine per Twitter Card
            images: article.openGraphImage ? [{ url: article.openGraphImage?.formats.small.url }] : [],
            card: 'summary_large_image', // O 'summary' a seconda del layout desiderato
        },
        // Altri metadati che potresti voler includere
      
    };
}

export default async function ArticleDetailPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams: { documentId?: string };
}) {
    const { slug } = params;
    const { documentId } = searchParams;

    console.log(`Accessing /blog/${slug} with documentId: ${documentId}`);

    if (!documentId) {
        console.error(`Error: documentId is missing in searchParams for slug: ${slug}`);
        notFound();
    }

const articleRes: StrapiSingleResponse<StrapiArticleType> | null = await fetchStrapiData(
    `articles/${documentId}`, {
        populate: [
            // Populate the main article image and openGraphImage directly
            'openGraphImage',
            // Populate all content blocks
            'contentBlocks',
            // Deeply populate fields within contentBlocks
            'contentBlocks.image', // For ParagraphBlock image
            'contentBlocks.bgImage', // For HeroBlock bgImage
            'contentBlocks.images' // For GalleryBlock images
            // Add other nested relations if you have more components with nested data
        ]
    }, 300);

    if (!articleRes || !articleRes.data) {
        console.error(`Article not found or API error for documentId: ${documentId}`);
        notFound();
    }

    const article: StrapiArticleType = articleRes.data;

    const renderContentBlock = (block: ContentBlock) => {
        switch (block.__component) {
            case 'text-components.paragraph':
                const paragraphBlock = block as ParagraphBlock;
                return (
                    <div key={paragraphBlock.id} className={`my-6 text-[20px] xm:text-[16px] sm:text-[16px] text-[#260A2F] leading-normal tracking-tight ${paragraphBlock.cssClasses}`}>
                        <p dangerouslySetInnerHTML={{ __html: paragraphBlock.text }}></p>
                        {/* Note: If paragraph images are part of text, they usually go within the HTML.
                            If they are standalone images associated with a paragraph block, this rendering is fine.
                            Ensure `image` in `ParagraphBlock` is correctly typed as `ImageType | null`. */}
                        {paragraphBlock.image && paragraphBlock.image.url && (
                            <Image
                                src={paragraphBlock.image.url}
                                alt={paragraphBlock.image.alternativeText || 'Paragraph Image'}
                                width={paragraphBlock.image.width}
                                height={paragraphBlock.image.height}
                                className={`rounded-[20px] my-6 object-cover ${paragraphBlock.imagePosition === 'left' ? 'float-left mr-6' : 'float-right ml-6'}`}
                            />
                        )}
                    </div>
                );
            case 'image-components.hero':
                const heroBlock = block as HeroBlock;
                return (
                    // HERO BLOCK within content blocks now uses a background image
                    <div
                        key={heroBlock.id}
                        className={`relative my-8 h-80 sm:h-96 md:h-[500px] flex items-center justify-center text-center p-6 rounded-[20px] overflow-hidden ${heroBlock.cssClasses}`}
                        style={{
                            backgroundImage: heroBlock.bgImage && heroBlock.bgImage.url ? `url(${process.env.NEXT_PUBLIC_STRAPI_API_URL}${heroBlock.bgImage.url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >

                        {/* Overlay for better text readability */}
                        {heroBlock.bgImage && heroBlock.bgImage.url && (
                            <div className="absolute inset-0 bg-black opacity-40 rounded-[20px]"></div>
                        )}
                        <div className="relative z-10 text-white"> {/* Text color set to white for readability on image */}
                            <h2 className="text-[40px] xm:text-[27px] sm:text-[27px] font-bold leading-tight tracking-tight mb-2">
                                {heroBlock.title}
                            </h2>
                            <p className="text-[20px] xm:text-[16px] sm:text-[16px] leading-normal tracking-tight">
                                {heroBlock.caption}
                            </p>
                        </div>
                    </div>
                );
            case 'text-components.quote':
                const quoteBlock = block as QuoteBlock;
                return (
                    <blockquote key={quoteBlock.id} className={`my-8 p-6 border-l-4 border-l-[#9FE870] bg-[#FFD7EF] italic text-[#260A2F] rounded-[20px] ${quoteBlock.cssClasses}`}>
                        <p className="text-[24px] xm:text-[20px] sm:text-[20px] leading-tight tracking-tighter mb-2">"{quoteBlock.text}"</p>
                        <footer className="text-right text-[18px] xm:text-[14px] sm:text-[14px] font-medium">
                            — {quoteBlock.author}
                            {quoteBlock.authorInfo && <span className="ml-1">, {quoteBlock.authorInfo}</span>}
                            {quoteBlock.authorLifespan && <span className="ml-1"> ({quoteBlock.authorLifespan})</span>}
                        </footer>
                    </blockquote>
                );
            case 'functional-components.cta':
                const ctaBlock = block as CtaBlock;
                return (
                    <div key={ctaBlock.id} className={`my-8 p-8 bg-amara-gold text-white rounded-[30px] text-center shadow-lg ${ctaBlock.cssClasses}`}>
                        <h2 className="text-[40px] xm:text-[27px] sm:text-[27px] font-bold mb-3 leading-tight tracking-tight">{ctaBlock.title}</h2>
                        {ctaBlock.subtitle && <h3 className="text-[24px] xm:text-[20px] sm:text-[20px] mb-4 leading-tight tracking-tighter">{ctaBlock.subtitle}</h3>}
                        {ctaBlock.paragraph && <p className="text-[20px] xm:text-[16px] sm:text-[16px] mb-6 leading-normal tracking-tight">{ctaBlock.paragraph}</p>}
                        {ctaBlock.buttonLabel && ctaBlock.buttonHref && (
                            <a href={ctaBlock.buttonHref} className="inline-block bg-[#FFD7EF] text-amara-gold font-bold py-3 px-8 rounded-full hover:bg-[#FFEB69] transition-all duration-300 ease-linear text-[20px]">
                                {ctaBlock.buttonLabel}
                            </a>
                        )}
                    </div>
                );
            case 'image-components.gallery':
                const galleryBlock = block as GalleryBlock;
                return (
                    <div key={galleryBlock.id} className={`my-8`}>
                        {galleryBlock.caption && <h3 className="text-[27px] sm:text-[20px] font-semibold text-[#260A2F] mb-6 leading-tight tracking-tight">{galleryBlock.caption}</h3>}
                        {/* Assuming images in GalleryBlock are directly an array of `ImageType` */}
                        {galleryBlock.images && galleryBlock.images.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {galleryBlock.images.map((img: ImageType) => ( // Use ImageType here
                                    <div key={img.id} className="relative w-full h-64 rounded-[20px] overflow-hidden shadow-md">
                                        <Image
                                            src={img.url} // Access url directly
                                            alt={img.alternativeText || 'Gallery Image'}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="object-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {!galleryBlock.images || galleryBlock.images.length === 0 && (
                            <p className="text-[16px] text-gray-500 italic">No images found for this gallery.</p>
                        )}
                    </div>
                );
            default:
                return (
                    <div key={`unknown-${(block as any).id}`} className="my-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
                        <p className="font-bold">Warning: Unknown content block component:</p>
                        <pre className="text-xs mt-2 overflow-x-auto">{JSON.stringify(block, null, 2)}</pre>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-amara-dark-blue text-[#FFD7EF] font-sans">
            <header className="bg-amara-dark-blue shadow-sm py-6 border-b border-[#0B3848]">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <a
                        href="/blog"
                        className="inline-flex items-center text-[#9FE870] hover:text-[#FFEB69] font-semibold transition-colors duration-200 ease-linear text-[20px]"
                    >
                        &larr; Back to Blog List
                    </a>
                </div>
            </header>

            {/* Main Article Hero Section using background image */}
            {article.thumbnail && article.thumbnail.url && (
                <div
                    className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center text-center"
                    style={{
                        backgroundImage: `url(${article.thumbnail.formats?.medium?.url})`, // Use large format if available, fallback to original
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Optional overlay for better text readability on hero thumbnail */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 text-white max-w-4xl px-4 mx-auto">
                        <h1 className="text-[80px] xm:text-[45px] sm:text-[50px] font-bold mb-4 leading-[80px] xm:leading-[50px] sm:leading-[60px] tracking-tighter">
                            {article.title}
                        </h1>
                        {article.subtitle && (
                            <h2 className="text-[40px] xm:text-[27px] sm:text-[30px] mb-6 leading-tight tracking-tight">
                                {article.subtitle}
                            </h2>
                        )}
                        {article.description && (
                            <p className="text-[23px] xm:text-[18px] sm:text-[20px] mb-10 leading-normal tracking-tight">
                                {article.description}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <main className="max-w-4xl mx-auto padding-x py-12 bg-[#FFD7EF] shadow-lg rounded-b-[30px] text-[#260A2F]">
                {/* Article Header (inside main for consistency, but hero handled above) */}
                {!article.thumbnail && ( // Only show if there's no main hero thumbnail, as the hero above covers this
                    <>
                        <h1 className="text-[80px] xm:text-[35px] sm:text-[40px] font-bold text-center mb-4 leading-[80px] xm:leading-[40px] sm:leading-[50px] tracking-tighter">
                            {article.title}
                        </h1>
                        {article.subtitle && (
                            <h2 className="text-[40px] xm:text-[27px] sm:text-[27px] text-[#0B3848] text-center mb-6 leading-tight tracking-tight">
                                {article.subtitle}
                            </h2>
                        )}
                        {article.description && (
                            <p className="text-[23px] text-[#0B3848] text-center mb-10 max-w-2xl mx-auto leading-normal tracking-tight">
                                {article.description}
                            </p>
                        )}
                    </>
                )}

                <div className="article-content">
                    {article.contentBlocks && article.contentBlocks.length > 0 ? (
                        article.contentBlocks.map((block) => renderContentBlock(block))
                    ) : (
                        <div className="py-10 text-center text-[#0B3848] italic text-[20px]">
                            <p>No content blocks found for this article.</p>
                            {/* <p>{JSON.stringify(article)}</p> // Uncomment for debugging if needed */}
                        </div>
                    )}
                </div>

                <div className="pt-8">
                    <p>Published: {new Date(article.publishedAt).toLocaleDateString()}</p>
                </div>
            </main>
        </div>
    );
}