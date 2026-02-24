"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
	return (
		<>
			<div
				id="footer"
				className="w-full flex flex-col items-center padding-x bg-lotus-dark-blue lg:bg-lotus-blue py-10">

				<div className="w-full grid grid-cols-1 lg:grid-cols-3">

					{/* First Column (1/3) - Logo and Address */}
					<div className="flex flex-col">
						<div className="flex justify-center lg:justify-start mb-16 lg-mb-0">
							<Image
								src="/logo-big.png"
								alt="Logo"
								width={300}
								height={300}
								className="w-48 lg:w-64 h-auto object-contain"
							/>
						</div>
					</div>

					{/* Second & Third Column (2/3) - Sub-grid for Contact/Social */}
					<div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10 lg:gap-16 mt-4">

						{/* Sub-column 1: Phone & Facebook */}
						<div className="flex flex-col gap-10">
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight mb-2">
									Phone
								</p>
								<Link
									className="text-[26px] lg:text-[30px] font-semibold text-lotus-light-gold hover:text-lotus-rosewood transition-colors duration-500 leading-tight tracking-tight"
									href={`tel:${process.env.NEXT_PUBLIC_STORE_PHONE_NUMBER}`}>
									{process.env.NEXT_PUBLIC_STORE_PHONE_NUMBER}
								</Link>
							</div>
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight mb-2">
									Facebook
								</p>
								<Link
									className="text-[26px] lg:text-[30px] font-semibold text-lotus-light-gold hover:text-lotus-rosewood transition-colors duration-500 leading-tight tracking-tight"
									href={process.env.NEXT_PUBLIC_STORE_FACEBOOK ?? "/"}>
									Our Facebook Page
								</Link>
							</div>
						</div>

						{/* Sub-column 2: Email & Instagram */}
						<div className="flex flex-col gap-10">
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight mb-2">
									E-mail
								</p>
								<Link
									className="text-[26px] lg:text-[30px] font-semibold text-lotus-light-gold hover:text-lotus-rosewood transition-colors duration-500 leading-tight tracking-tight break-all"
									href={`mailto:${process.env.NEXT_PUBLIC_STORE_EMAIL}`}>
									{process.env.NEXT_PUBLIC_STORE_EMAIL}
								</Link>
							</div>
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight mb-2">
									Instagram
								</p>
								<Link
									className="text-[26px] lg:text-[30px] font-semibold text-lotus-light-gold hover:text-lotus-rosewood transition-colors duration-500 leading-tight tracking-tight"
									href={process.env.NEXT_PUBLIC_STORE_INSTAGRAM ?? "/"}>
									Our Instagram Profile
								</Link>
							</div>
						</div>

					</div>
				</div>

				<div className="w-full flex flex-col mt-10">
					<motion.div
						initial={{ borderTopWidth: 0, width: "0%" }}
						viewport={{ once: true }}
						whileInView={{
							borderTopWidth: 1,
							width: "100%",
							borderColor: "#C4A484",
							origin: "left",
						}}
						transition={{
							duration: 1,
							ease: "easeInOut",
						}}
					/>
					<div className="w-full flex items-center justify-between py-4">
						<motion.p
							initial={{ y: "100%" }}
							viewport={{ once: true }}
							whileInView={{
								y: 0,
							}}
							transition={{
								duration: 1,
								ease: "easeInOut",
							}}
							className="text-lotus-bronze text-sm overflow-hidden">
							{(process.env.NEXT_PUBLIC_STORE_NAME ?? "") + " - " + new Date().getFullYear()}
						</motion.p>
					</div>
				</div>
			</div>
		</>
	);
}
