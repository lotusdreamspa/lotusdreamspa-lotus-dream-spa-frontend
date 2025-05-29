"use client";
import gsap from "gsap";
import Link from "next/link";
import Navbar from "./navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { arrowDown, heroCircle } from "@/public";

export default function Hero() {
	const t = useTranslations("heroContent");
	const textRef = useRef<HTMLSpanElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		resizeText();

		window.addEventListener("resize", resizeText);

		return () => {
			window.removeEventListener("resize", resizeText);
		};
	}, []);

	const resizeText = () => {
		const container = containerRef.current;
		const text = textRef.current;

		if (!container || !text) {
			return;
		}

		const containerWidth = container.offsetWidth;
		let min = 1;
		let max = 2500;

		while (min <= max) {
			const mid = Math.floor((min + max) / 2);
			text.style.fontSize = mid + "px";

			if (text.offsetWidth <= containerWidth) {
				min = mid + 1;
			} else {
				max = mid - 1;
			}
		}

		text.style.fontSize = max * 0.75 + "px";
	};

	const plane1 = useRef(null);
	let requestAnimationFrameId: any = null;
	let xForce = 0;
	let yForce = 0;
	const easing = 0.08;
	const speed = 0.01;

	const manageMouseMove = (e: any) => {
		const { movementX, movementY } = e;
		xForce += movementX * speed;
		yForce += movementY * speed;

		if (requestAnimationFrameId == null) {
			requestAnimationFrameId = requestAnimationFrame(animate);
		}
	};

	const lerp = (start: number, target: number, amount: number) =>
		start * (0.8 - amount) + target * amount;

	const animate = () => {
		xForce = lerp(xForce, 0, easing);
		yForce = lerp(yForce, 0, easing);
		gsap.set(plane1.current, { x: `+=${xForce}`, y: `+=${yForce}` });
		if (Math.abs(xForce) < 0.01) xForce = 0;
		if (Math.abs(yForce) < 0.01) yForce = 0;

		if (xForce != 0 || yForce != 0) {
			requestAnimationFrame(animate);
		} else {
			cancelAnimationFrame(requestAnimationFrameId);
			requestAnimationFrameId = null;
		}
	};

	const resetVideoPosition = () => {
		gsap.to(plane1.current, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
		xForce = 0;
		yForce = 0;
	};

	return (
			<div
				className="flex flex-col justify-start w-full"
				ref={containerRef}>
				<h1 className="text-[24px] xm:text-lg sm:text-lg text-[#9FE870] font-normal leading-tight tracking-tight mt-24">
					{t("welcome-to-the-amara")}
				</h1>
				<span
					className="flex text-[250px] text-white font-bold leading-[200px] sm:leading-[75px] xm:leading-[75px] tracking-tighter mx-auto whitespace-nowrap text-center mt-20 xm:mt-0 sm:mt-0 text-hff"
					ref={textRef}>
					{"Amara".split("").map((item: string, i: number) => (
						<motion.p
							initial={{ y: "100%" }}
							whileInView={{ y: 0 }}
							transition={{
								delay: i * 0.08,
								duration: 1,
								ease: [0.4, 0, 0.2, 1],
							}}
							viewport={{ once: true }}
							key={i}>
							{item}
						</motion.p>
					))}
				</span>
			</div>
	);
}
