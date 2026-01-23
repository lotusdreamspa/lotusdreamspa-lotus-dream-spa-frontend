"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";


export default function Footer() {
	return (
		<>
			<div
				id="footer"
				className="w-full  flex flex-col items-center padding-x justify-end pt-5">
				<div className="w-full flex justify-between gap-5 py-10 xm:flex-col sm:flex-col">
					<div className="w-1/2 xm:w-full sm:w-full flex gap-5 justify-between xm:flex-col sm:flex-col">
						<div className="flex flex-col gap-5">
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight">
									Phone
								</p>
								<Link
									className="text-[30px] font-semibold text-lotus-gold leading-tight tracking-tight"
									href={`tel:${process.env.NEXT_PUBLIC_STORE_PHONE_NUMBER}`}>
									{process.env.NEXT_PUBLIC_STORE_PHONE_NUMBER}
								</Link>
							</div>
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight">
									Facebook
								</p>
								<Link
									className="text-[30px] font-semibold text-lotus-gold leading-tight tracking-tight"
									href={process.env.NEXT_PUBLIC_STORE_FACEBOOK ?? "/"}>
									Our Facebook Page
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-5">
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight">
									E-mail
								</p>
								<Link
									className="text-[30px] font-semibold text-lotus-gold leading-tight tracking-tight"
									href={`mailto:${process.env.NEXT_PUBLIC_STORE_EMAIL}`}>
									{process.env.NEXT_PUBLIC_STORE_EMAIL}
								</Link>
							</div>
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight">
									Instagram
								</p>
								<Link
									className="text-[30px] font-semibold text-lotus-gold leading-tight tracking-tight"
									href={process.env.NEXT_PUBLIC_STORE_INSTAGRAM ?? "/"}>
									Our Instagtram Profile
								</Link>
							</div>
						</div>
					</div>
					<div className="w-[30%] xm:w-full sm:w-full">
						<div className="flex flex-col gap-10">
							<div className="flex flex-col">
								<p className="text-[16px] text-lotus-bronze leading-tight tracking-tight">
									Address
								</p>
								<p
									className="text-[30px] font-semibold text-lotus-gold leading-tight tracking-tight"
									>
									{process.env.NEXT_PUBLIC_STORE_ADDRESS}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col">
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
