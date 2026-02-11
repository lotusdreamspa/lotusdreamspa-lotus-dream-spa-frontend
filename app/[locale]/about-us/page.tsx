import type { Metadata } from "next";
import {
	AnimatedTextSectionElement,
	NavbarElement,
	FooterElement,
	HeroElement,
	ImageCtaListElement,
} from "@/components";

export const metadata: Metadata = {
    title: "About Us | Lotus Dream SPA | Best olistic spa in Siem Reap",
    description: "Discover the philosophy of Lotus Dream SPA. We are the premier destination for holistic care in Kandal Village, dedicated to being the best olistic spa in Siem Reap through authentic wellness traditions.",
};

const ctaData = [
	{
		imgPath: "/images/home/img-1.webp",         // Percorso nella cartella public
		translationNamespace: "HomepageCtaContent",
		ctaTitle: "intro_title",              // La chiave del titolo nel JSON
		ctaParagraph: "intro_desc",      // La chiave del testo nel JSON
		lateralText: "intro_lateral",           // La chiave del testo laterale
		ctaLinkLabel: "intro_link",        // La chiave dell'etichetta del link
		ctaLinkHref: "/about",                // Dove porta il link
	}
];

export default function AboutUsPage() {
	return (
		<>
			<div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
				<NavbarElement />
				<HeroElement title="About" hasSubtitle={false} />
			</div>
			<AnimatedTextSectionElement
				translationKey="aboutUsContent"
				paragraphWidth="w-[90%]"
				textColor="text-white"
			/>

			<ImageCtaListElement items={ctaData} />
			<FooterElement />

		</>
	);
}
