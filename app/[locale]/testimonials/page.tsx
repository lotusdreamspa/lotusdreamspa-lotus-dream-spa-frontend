import {
	NavbarElement,
	FooterElement,
	HeroElement,
	ReusableSlider,
} from "@/components";

export default function Testimonialspage() {
	return (
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
	);
}
