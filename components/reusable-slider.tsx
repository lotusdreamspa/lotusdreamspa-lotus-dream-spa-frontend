"use client";
import "swiper/css";
import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Navigation } from "swiper/modules";
import { arrowLeft, arrowRight } from "@/public";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReusableSliderProps } from "@/types"; // Importing the interface

export default function ReusableSlider({
	translationKey,
	numberOfSlides,
	bgColor = "#FFC091",
	textColor = "#260A2F", // Default color for main headings
	sliderCardBgColor = "#0B3848",
	sliderCardTextColor = "#FFC091",
	arrowButtonBgColor = "#9fe870",
	arrowButtonHoverColor = "#FFEB69",
}: ReusableSliderProps) {
	const t = useTranslations(translationKey);
	const swiperRef = useRef<any | null>(null);

	const handlePrev = () => {
		if (swiperRef.current) swiperRef.current.slidePrev();
	};
	const handleNext = () => {
		if (swiperRef.current) swiperRef.current.slideNext();
	};

	// Funzione per renderizzare le slide dinamicamente
	const renderSlides = () => {
		const slides = [];
		for (let i = 1; i <= numberOfSlides; i++) {
			slides.push(
				<SwiperSlide key={`slide-${i}`}>
					<div
						className="p-7 rounded-[30px] swiper-slide min-h-[450px] xm:min-h-[500px] sm:min-h-[500px] cursor-grab"
						style={{ backgroundColor: sliderCardBgColor }}>
						<div className="flex flex-col gap-3">
							<h2
								className="text-[70px] xm:text-[50px] sm:text-[50px] font-bold leading-tight"
								style={{ color: sliderCardTextColor }}>
								{t(`slide-${i}.title`)}
							</h2>
							<h2
								className="text-[40px] xm:text-[20px] sm:text-[20px] font-medium leading-tight"
								style={{ color: sliderCardTextColor }}>
								{t(`slide-${i}.heading`)}
							</h2>
							<p
								className="text-[20px] xm:text-[16px] sm:text-[16px] font-normal leading-normal tracking-tight"
								style={{ color: sliderCardTextColor }}>
								{t(`slide-${i}.par`)}
							</p>
						</div>
					</div>
				</SwiperSlide>
			);
		}
		return slides;
	};

	return (
		<div
			id="transformation"
			className="w-full flex flex-col gap-10 pb-10"
			style={{ backgroundColor: bgColor }}>
			<div className="w-full flex justify-start items-center padding-x">
				<div className="w-[72%] flex flex-col gap-7 xm:w-full sm:w-full">
					<h4
						className="text-[24px] leading-tight tracking-tighter mt-8"
						style={{ color: textColor }}>
						{t("sliderHeading1")}
					</h4>

					<h1
						className="text-[80px] xm:text-[35px] sm:text-[40px] xm:leading-[40px] sm:leading-[50px] font-bold leading-[80px] tracking-tighter"
						style={{ color: textColor }}>
						{t("sliderHeading2")}
					</h1>
					<h4
						className="text-[24px] xm:text-[20px] sm:text-[20px] leading-normal tracking-tighter"
						style={{ color: textColor }}>
						{t("sliderHeading3")}
					</h4>
				</div>
			</div>
			<div className="w-full">
				<div className="p-5 overflow-hidden">
					<Swiper
						modules={[Navigation]}
						loop
						spaceBetween={30}
						breakpoints={{
							0: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							400: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							768: {
								slidesPerView: 1,
								spaceBetween: 20,
							},
							1024: {
								slidesPerView: 2,
								spaceBetween: 20,
							},
							1490: {
								slidesPerView: 2,
								spaceBetween: 20,
							},
						}}
						onSwiper={(swiper) => (swiperRef.current = swiper)}>
						{renderSlides()}
					</Swiper>
					<div className="flex mt-6 w-full gap-2">
						<div
							onClick={handlePrev}
							className="transition-all duration-200 ease-linear cursor-pointer px-3 py-2 rounded-[30px]"
							style={{ backgroundColor: arrowButtonBgColor }}
							onMouseEnter={(e) =>
								((e.currentTarget as HTMLElement).style.backgroundColor =
									arrowButtonHoverColor)
							}
							onMouseLeave={(e) =>
								((e.currentTarget as HTMLElement).style.backgroundColor =
									arrowButtonBgColor)
							}>
							<Image
								src={arrowLeft}
								alt="arrowLeft"
								className="!w-[55px]"
								width={55}
								height={55}
							/>
						</div>
						<div
							onClick={handleNext}
							className="transition-all duration-200 ease-linear cursor-pointer px-3 py-2 rounded-[30px]"
							style={{ backgroundColor: arrowButtonBgColor }}
							onMouseEnter={(e) =>
								((e.currentTarget as HTMLElement).style.backgroundColor =
									arrowButtonHoverColor)
							}
							onMouseLeave={(e) =>
								((e.currentTarget as HTMLElement).style.backgroundColor =
									arrowButtonBgColor)
							}>
							<Image
								src={arrowRight}
								alt="arrowRight"
								width={55}
								height={55}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}