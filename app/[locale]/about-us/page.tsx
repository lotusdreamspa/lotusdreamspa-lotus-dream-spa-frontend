import type { Metadata } from "next";
import {
	AnimatedTextSectionElement,
	NavbarElement,
	FooterElement,
	HeroElement,
	ImageCtaListElement,
} from "@/components";
import { fetchAllMasseuses } from "@/services/masseuses";

export const metadata: Metadata = {
	title: "About Us | Lotus Dream SPA | Best olistic spa in Siem Reap",
	description: "Discover the philosophy of Lotus Dream SPA. We are the premier destination for holistic care in Kandal Village, dedicated to being the best olistic spa in Siem Reap through authentic wellness traditions.",
};

interface AboutUsPageProps {
	params: Promise<{
		locale: string;
	}>;
}

export default async function AboutUsPage(props: AboutUsPageProps) {
	const params = await props.params;
	const { locale } = params;
	const masseuses = await fetchAllMasseuses();

	const masseuseItems = masseuses.map((masseuse: any) => ({
		imgPath: masseuse.img?.url || "/images/placeholder.jpg",
		translationNamespace: "common",
		ctaTitle: masseuse.name,
		ctaParagraph: locale === "kh" ? (masseuse.khDescription || masseuse.description) : masseuse.description,
		lateralText: "Staff",
		skipTranslation: true,
		// No ctaLinkHref, so button will be hidden
	}));

	return (
		<>
			<div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center
			 gap-10">
				<NavbarElement />
				<HeroElement title="About" hasSubtitle={false} bgImg="/images/about/hero.jpg" />
			</div>
					<AnimatedTextSectionElement
				translationKey="aboutUsContent"
				paragraphWidth="w-[90%]"
				textColor="text-white"
			/>
			<div className="px-16">
				<ImageCtaListElement items={masseuseItems} />
			</div>

			<FooterElement />

		</>
	);
}
