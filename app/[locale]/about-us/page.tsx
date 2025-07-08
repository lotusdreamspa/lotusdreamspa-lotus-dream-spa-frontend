"use client";
import Lenis from "@studio-freight/lenis";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
	AnimatedTextSection,
	Navbar,
	Footer,
	Hero,
	ReusableSlider,
	Preload,
	Paragraph
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
						<Hero heroWord="About" />
					</div>
					<AnimatedTextSection
						translationKey="aboutUsContent"
						paragraphWidth="w-[90%]"
						textColor="text-amara-dark-blue"
						svgPath="/leaf.png"
						svgPositionClasses="right-0 -bottom-32" // Adjust the position classes as needed
					/>
					<div id="our-values">

						<ReusableSlider
							translationKey="aboutUsSliderContent"		// Adjust the translation key as needed
							numberOfSlides={5} 
							arrowButtonBgColor="#0B3848"
							arrowButtonHoverColor="#C09C60"// Adjust the number of slides as needed	
						/>
					</div>

					<Paragraph
						translationKey="aboutUsParagraph"
						bgColor="bg-[#FFEB69]"
						textColor="text-amara-dark-blue"
						paragraphWidth="w-[70%]"
						buttonLabel="Discover"
						buttonLabel2="Amara Beer Lab"
						buttonHref="https://amarabeerlab.com/"
						buttonBgColor="bg-amara-dark-blue"
						buttonTextColor="text-amara-gold"
						numberOfParagraphs={5}
					/>
					<Footer />
				</>
			)}
		</>
	);
}
