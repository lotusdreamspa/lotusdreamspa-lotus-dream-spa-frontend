"use client";
import Slider from "@/components/slider";
import Lenis from "@studio-freight/lenis";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
	Collaboration,
	NotJust,
	Navbar,
	Footer,
	Hero,
	VideoCta,
	Journey,
	Preload,
	OurWay
} from "@/components";

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
						<Hero />
					</div>
					<Slider />
					<Collaboration />
					<Footer />
				</>
			)}
		</>
	);
}
