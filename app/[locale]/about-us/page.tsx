"use client";
import Lenis from "@studio-freight/lenis";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
	AnimatedTextSection,
	NavbarElement,
	FooterElement,
	HeroElement,
	Preload,
	ImageCtaListElement,
} from "@/components";

const ctaData = [
	{
		imgPath: "/images/home/img-1.webp",         // Percorso nella cartella public
		translationNamespace: "HomepageCtaContent",
		ctaTitle: "intro_title",              // La chiave del titolo nel JSON
		ctaParagraph: "intro_desc",      // La chiave del testo nel JSON
		lateralText: "intro_lateral",           // La chiave del testo laterale
		ctaLinkLabel: "intro_link",        // La chiave dell'etichetta del link
		ctaLinkHref: "/about",                // Dove porta il link
	},
	{
		imgPath: "/images/home/img-2.webp",
		translationNamespace: "HomepageCtaContent",
		ctaTitle: "treat_title",              // La chiave del titolo nel JSON
		ctaParagraph: "treat_desc",
		lateralText: "treat_lateral",
		ctaLinkLabel: "treat_link",
		ctaLinkHref: "/menu",
	},
	{
		imgPath: "/images/home/img-3.webp",
		translationNamespace: "HomepageCtaContent",     // O riutilizzare lo stesso
		ctaTitle: "more_title",              // La chiave del titolo nel JSON
		ctaParagraph: "more_desc",
		lateralText: "more_lateral",
		ctaLinkLabel: "more_link",
		ctaLinkHref: "/menu",
	},
	{
		imgPath: "/images/home/img-4.webp",
		translationNamespace: "HomepageCtaContent",     // O riutilizzare lo stesso
		ctaTitle: "contacts_title",              // La chiave del titolo nel JSON
		ctaParagraph: "contacts_desc",
		lateralText: "contacts_lateral",
		ctaLinkLabel: "contacts_link",
		ctaLinkHref: "/contacts",
	},
];

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
						<HeroElement title="About" hasSubtitle={false} />
					</div>
					<AnimatedTextSection
						translationKey="aboutUsContent"
						paragraphWidth="w-[90%]"
						textColor="text-white"
					/>

					<ImageCtaListElement items={ctaData}/>
					<FooterElement />
				</>
			)}
		</>
	);
}
