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
import Link from "next/link";
import { TextHover } from "@/components";

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
                        <Hero heroWord="Find   Us"/>

                    </div>

                    <div className="w-full flex flex-col items-center justify-center mb-16">
                        <div className="w-full lg:w-1/2 xl:w-3/5 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">

                            <iframe
                                className="w-full"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.909463185599!2d103.85339852479922!3d13.35590545633676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311017dcaa9040d9%3A0x4edae835d38d891c!2sThe%20Amara%20Bar%20and%20Restaurant!5e0!3m2!1sit!2skh!4v1748493131137!5m2!1sit!2skh"
                                width="100%"
                                height="450"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade" />
                        </div>
                        <div className="w-full flex justify-center my-16">
                            <div className="group flex gap-2 items-center text-[17px] font-semibold capitalize text-[#260A2F] bg-secondary rounded-full leading-tight tracking-tight px-4 py-3">
                                <Link href="https://www.google.com/maps/dir//The+Amara+Bar+and+Restaurant,+629+Central+Market+St,+Krong+Siem+Reap+12131/@13.3570307,103.8155963,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x311017dcaa9040d9:0x4edae835d38d891c!2m2!1d103.8567962!2d13.3569505?entry=ttu&g_ep=EgoyMDI1MDUyNi4wIKXMDSoASAFQAw%3D%3D" className="w-36 text-center">
                                    <TextHover
                                        titile1="Open in Google Maps"
                                        titile2="Let's Go!"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
}
