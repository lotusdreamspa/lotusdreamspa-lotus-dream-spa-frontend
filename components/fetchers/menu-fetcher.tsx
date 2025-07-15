// components/blog-post-fetcher.tsx
'use client'; // This component will run on the client

import React, { useState, useEffect } from 'react';
import { fetchMenuData } from "@/lib/strapi";
import MenuRenderer from "@/components/renderers/menu-renderer";
import { Category } from '@/types';

export default function MenuFetcher() {
    const [menuItems, setMenuItems] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        async function getMenu() {
            try {
                setLoading(true); // Set loading to true before fetching
                const data = await fetchMenuData('categories', {
                    populate: ['products'], // Populate necessary fields
       
                }, 300); // The revalidate option won't apply here as it's client-side fetch

                const typedData = data as { data: Category[] };
                setMenuItems(typedData.data);
            } catch (err) {
                setError("Failed to load menu items.");
                console.error(err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        }

        getMenu();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">Loading updated menu...</p>
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

    if (menuItems.length === 0) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">Coming soon</p>
            </div>
        );
    }

    return (
        <MenuRenderer Categories={menuItems} />
    );
}