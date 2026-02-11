"use client";

import React, { useEffect, useState } from 'react';

type GoogleReview = {
    rating: number;
    date: string;
    source: string;
    snippet: string;
    link: string;
    userData?: {
        name: string;
        imageUrl: string;
        link: string;
    }
};

type GoogleReviewsResponse = {
    reviews: GoogleReview[];
};

export default function GoogleReviewsFetcher() {
    const [data, setData] = useState<GoogleReviewsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch('/api/reviews');
                if (!res.ok) {
                    throw new Error(`Failed to fetch reviews: ${res.statusText}`);
                }
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                console.error("Error details:", err);
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    // Log to console as requested by user previously to "retrieve the object"
    console.log("Google Reviews API Data:", data);

    return (
        <div className="p-4 bg-white rounded shadow text-black">
            <h2 className="text-xl font-bold mb-4">Google Reviews (API Data)</h2>
            <pre className="overflow-auto max-h-96 text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
