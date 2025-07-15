"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Marquee, OurWayCards } from "@/components";
import { thanksFor } from "@/public";

export default function OurWay() {
	const t = useTranslations("ourWayContent");
	return (
		<div
			id="our-way"
			className="w-full py-20 bg-white relative">
			<motion.div
				animate={{ rotate: [-360, 360] }}
				transition={{
					repeat: Infinity,
					repeatType: "loop",
					duration: 20,
					ease: "linear",
				}}
				className="flex items-center absolute -top-24 right-4">
				<Image
					src={thanksFor}
					alt="heroCircleImg"
					width={240}
					height={240}
				/>
			</motion.div>
			<Marquee
				className="text-[#260A2F]"
				titile1="Our"
				titile2="Way"
			/>
			<div className="w-full flex items-center justify-center">
				<div className="w-[80%] xm:w-full sm:w-full xm:padding-x sm:padding-x">
					<p
						className="text-[22px] text-[#260A2F] leading-tight tracking-tight"
						dangerouslySetInnerHTML={{ __html: t("ourWayHeading") }}
					/>
				</div>
			</div>
			<div className="w-full padding-x py-20 xm:py-10 sm:py-10">
				<OurWayCards />
			</div>
		</div>
	);
}
