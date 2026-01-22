"use client";
import Lenis from "@studio-freight/lenis";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
	NavbarElement,
	FooterElement,
	HeroElement,
	ReusableSlider,
	Preload,
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
					<div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
						<NavbarElement />
						<HeroElement title="Some Reviews" hasSubtitle={false} />
					</div>

					<div id="trip-advisor-slider">

						<ReusableSlider
							translationKey="tripAdvisorSliderContent"		// Adjust the translation key as needed
							numberOfSlides={5} 
							arrowButtonBgColor="#0B3848"
							arrowButtonHoverColor="#C09C60"// Adjust the number of slides as needed	
						/>
					</div>
					<FooterElement />
				</>
			)}
		</>
	);
}
