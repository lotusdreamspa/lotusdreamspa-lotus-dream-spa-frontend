"use client";
import Lenis from "@studio-freight/lenis";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    Navbar,
    Hero,
    Preload,
    Footer
} from "@/components";

import MenuFetcher from "@/components/menu-fetcher";


export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const lenis = new Lenis();

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        const timeout = setTimeout(() => {
            setIsLoading(false);
            document.body.style.cursor = "default";
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">{isLoading && <Preload />}</AnimatePresence>
            {!isLoading && (
                <>
                    <div className="w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
                        <Navbar />
                        <Hero heroWord="Menu"/>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center mb-16">
                        <MenuFetcher />
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
}
