import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";


export default function Footer() {
	const t = useTranslations("footerContent");
	return (
		<>
			<div
				id="footer"
				className="w-full  flex flex-col items-center padding-x justify-end pt-5">
				<div className="w-full flex justify-between gap-5 py-10 xm:flex-col sm:flex-col">
					<div className="w-1/2 xm:w-full sm:w-full flex gap-5 justify-between xm:flex-col sm:flex-col">
						<div className="flex flex-col gap-5">
							<div className="flex flex-col">
								<p className="text-[16px] text-[#9FE870] leading-tight tracking-tight">
									Phone
								</p>
								<Link
									className="text-[30px] font-semibold text-[#9FE870] leading-tight tracking-tight"
									href={`tel:${process.env.NEXT_PUBLIC_STORE_PHONE_NUMBER}`}>
									{process.env.NEXT_PUBLIC_STORE_PHONE_NUMBER}
								</Link>
							</div>
							<div className="flex flex-col">
								<p className="text-[16px] text-[#9FE870] leading-tight tracking-tight">
									Facebook
								</p>
								<Link
									className="text-[30px] font-semibold text-[#9FE870] leading-tight tracking-tight"
									href={process.env.NEXT_PUBLIC_STORE_FACEBOOK ?? "/"}>
									Our Facebook Page
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-5">
							<div className="flex flex-col">
								<p className="text-[16px] text-[#9FE870] leading-tight tracking-tight">
									E-mail
								</p>
								<Link
									className="text-[30px] font-semibold text-[#9FE870] leading-tight tracking-tight"
									href={`mailto:${process.env.NEXT_PUBLIC_STORE_EMAIL}`}>
									{process.env.NEXT_PUBLIC_STORE_EMAIL}
								</Link>
							</div>
							<div className="flex flex-col">
								<p className="text-[16px] text-[#9FE870] leading-tight tracking-tight">
									Instagram
								</p>
								<Link
									className="text-[30px] font-semibold text-[#9FE870] leading-tight tracking-tight"
									href={process.env.NEXT_PUBLIC_STORE_INSTAGRAM ?? "/"}>
									Our Instagtram Profile
								</Link>
							</div>
						</div>
					</div>
					<div className="w-[30%] xm:w-full sm:w-full">
						<div className="flex flex-col gap-10">
							<div className="flex flex-col">
								<p className="text-[16px] text-[#9FE870] leading-tight tracking-tight">
									Address
								</p>
								<Link
									className="text-[30px] font-semibold text-[#9FE870] leading-tight tracking-tight"
									href="/">
									{process.env.NEXT_PUBLIC_STORE_ADDRESS}
								</Link>
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
							borderColor: "#9FE870",
							origin: "left",
						}}
						transition={{
							duration: 1,
							ease: "easeInOut",
						}}
					/>
					<div className="w-full flex items-center justify-between py-4">
						<motion.h2
							initial={{ y: "100%" }}
							viewport={{ once: true }}
							whileInView={{
								y: 0,
							}}
							transition={{
								duration: 1,
								ease: "easeInOut",
							}}
							className="text-[#9FE870] text-sm overflow-hidden">
							{(process.env.NEXT_PUBLIC_STORE_NAME ?? "") + " - " + new Date().getFullYear()}
						</motion.h2>
						<motion.h2
							initial={{ y: "100%" }}
							viewport={{ once: true }}
							whileInView={{
								y: 0,
							}}
							transition={{
								duration: 1,
								ease: "easeInOut",
							}}
							className="text-[#9FE870] text-sm overflow-hidden">
							Privacy Statement
						</motion.h2>
					</div>
				</div>
			</div>
		</>
	);
}
