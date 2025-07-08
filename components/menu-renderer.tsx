"use client"; // This component needs to be a Client Component for Swiper and Framer Motion

import { useRef } from "react";

import { useScroll, useTransform, motion } from "framer-motion";
import { div } from "framer-motion/client";

import { getStrapiMedia } from "@/lib/client-utils/media";

import { Category } from "@/types"; // Adjust the import path based on your project structure

// Define the props for this component
interface MenuRendererProps {
    Categories: Category[];
}

export default function MenuRenderer({ Categories }: MenuRendererProps) {
    if (!Categories || Categories.length === 0) {
        return (
            <div className="w-full bg-amara-dark-blue py-10 padding-x">
                <p className="text-white text-center">Nothing to see here yet, but check back soon for updates!</p>
            </div>
        );
    }

    // Define the desired order of categories
    const categoryOrder = [
        "coffee",
        "iced coffee",
        "tea",
        "iced tea",
        "extras",
        "smoothie",
        "probiotic",
        "porrdige",
        "sweet breakfast",
        "savory breakfast",
        "snack",
        "beer",
        "softdrink",
        "cocktail",
        "liquor",
    ];

    // Create a map for quick lookup of category order
    const categoryOrderMap = new Map(
        categoryOrder.map((category, index) => [category, index])
    );

    // Sort the Categories array
    const sortedCategories = [...Categories].sort((a, b) => {
        const orderA = categoryOrderMap.get(a.name.toLowerCase()) ?? Infinity;
        const orderB = categoryOrderMap.get(b.name.toLowerCase()) ?? Infinity;
        return orderA - orderB;
    });

    return (
        <div id="menu" className="w-full bg-amara-dark-blue py-10 padding-x">
            <div className="w-full pb-10">
                <div className="p-5 overflow-hidden">
                    {sortedCategories.map((cat) => {
                        // Get the full URL for the thumbnail image
                        return (
                            <div key={cat.id}>
                                <motion.div className="w-full p-16 xm:p-0 sm:p-0 flex justify-between rounded-[30px] gap-20 xm:gap-10 sm:gap-10 xm:flex-col sm:flex-col">
                                    <div className="w-full p-4">
                                        <h3 className="text-amara-gold text-6xl bolder font-hff text-center">{cat.name}</h3>
                                        {cat.products && cat.products.length > 0 ? (
                                            <ul className="max-w-lg w-lg mt-4 mx-auto border border-amara-dark-blue rounded-lg pt-4 space-y-2">
                                                {cat.products.map((product) => (
                                                    <li key={product.sku} className="text-white text-lg px-4 py-2 ">
                                                        <div className="flex items-start justify-between border-b border-white pb-4 mb-8">
                                                            <div className="">
                                                                <p>{product.name}</p>
                                                                <p className="text-sm opacity-50">{product.description}</p>
                                                            </div>
                                                            <span className="text-amara-gold font-bold">${product.price}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-white text-lg">No products available in this category.</p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}