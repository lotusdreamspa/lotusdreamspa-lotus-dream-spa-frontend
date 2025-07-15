// components/blog-post-fetcher.tsx
'use client'; // This component will run on the client

import React, { useState, useEffect } from 'react';
import { fetchStrapiData } from "@/lib/strapi";
import PostRender from "@/components/renderers/post-renderer"; // This is now your Server Component for rendering
import { Article } from '@/types';

export default function BlogPostFetcher() {
    const [blogPosts, setBlogPosts] = useState<Article[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        async function getPosts() {
            try {
                setLoading(true); // Set loading to true before fetching
                const data = await fetchStrapiData('articles', {
                    populate: ['thumbnail'], // Populate necessary fields
                    pagination: {
                        limit: 10,
                    }
                }, 300); // The revalidate option won't apply here as it's client-side fetch

                const typedData = data as { data: Article[] };
                setBlogPosts(typedData.data);
            } catch (err) {
                setError("Failed to load blog posts.");
                console.error(err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        }

        getPosts();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">Loading blog posts...</p>
            </div>
        );
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