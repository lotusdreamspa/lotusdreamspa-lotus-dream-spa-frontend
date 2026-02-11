import type { Metadata } from "next";
import {
	NavbarElement,
	FooterElement,
	HeroElement,
	ReusableSliderElement,
} from "@/components";
import { fetchGoogleReviews } from "@/services/reviews";

export const metadata: Metadata = {
	title: "Testimonials & Reviews | Lotus Dream SPA | Best olistic spa in Siem Reap",
	description: "Read what our guests say about their experience. Discover why travelers and locals consider Lotus Dream SPA in Kandal Village the best olistic spa in Siem Reap.",
};

export default async function Testimonialspage() {
	const reviews = await fetchGoogleReviews();
	return (
		<>
			<div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
				<NavbarElement />
				<HeroElement title="Some Reviews" hasSubtitle={false} />
			</div>

			<div id="trip-advisor-slider">

				<ReusableSliderElement
					translationKey="reviewsSliderContent"
					numberOfSlides={reviews.length}
					bgColor="#FFC091" // Matches lotus-blue
					textColor="#0B3848" // Lotus bronze/gold
					sliderCardBgColor="#FFF"
					sliderCardTextColor="#000"
					arrowButtonBgColor="#0B3848"
					arrowButtonHoverColor="#b56576"
					reviews={reviews}
				/>
			</div>
			<FooterElement />
		</>
	);
}
