import {
	NavbarElement,
	HeroElement,
	FooterElement,
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
	return (
		<>
			<NavbarElement />
			<HeroElement bgImg="/images/home/hero/hero-sample.jpg" />
			<div className="w-full min-h-screen flex flex-col items-center justify-between md:justify-center padding-x gap-10">
				<ImageCtaListElement items={ctaData} />
			</div>
			<FooterElement />
		</>
	);
}
