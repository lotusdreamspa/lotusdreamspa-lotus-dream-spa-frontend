import type { Metadata } from "next";
import {
	NavbarElement,
	FooterElement,
	HeroElement,
	ReusableSliderElement,
} from "@/components";


export const metadata: Metadata = {
    title: "Testimonials & Reviews | Lotus Dream SPA | Best olistic spa in Siem Reap",
    description: "Read what our guests say about their experience. Discover why travelers and locals consider Lotus Dream SPA in Kandal Village the best olistic spa in Siem Reap.",
};

export default function Testimonialspage() {
	return (
		<>
			<div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
				<NavbarElement />
				<HeroElement title="Some Reviews" hasSubtitle={false} />
			</div>
			<div id="trip-advisor-slider">

				<ReusableSliderElement
					translationKey="tripAdvisorSliderContent"		// Adjust the translation key as needed
					numberOfSlides={5}
					arrowButtonBgColor="#0B3848"
					arrowButtonHoverColor="#b56576"// Adjust the number of slides as needed	
				/>
			</div>
			<FooterElement />
		</>
	);
}
