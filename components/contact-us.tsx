import Image from "next/image";
import { blackCircle } from "@/public";
import { useTranslations } from "next-intl";
import { TextHover, Marquee } from "@/components";
import Link from "next/link";
export default function ContactUs() {
    const t = useTranslations("contactUsContent");
    return (
        <>
            <div
                id="contact-us"
                className="w-full h-screen flex flex-col items-center padding-x justify-between pt-5">
                <Marquee
                    titile1="Get"
                    titile2="in touch"
                    className="text-[#ffeb69]"
                />
                <div className="w-[80%] flex flex-col gap-10 xm:w-full sm:w-full">
                    <div>
                        <h1 className="text-[60px] xm:text-[40px] sm:text-[40px] xm:leading-[40px] sm:leading-[40px] text-[#ffeb69] font-bold leading-[62px] tracking-tight text-center xm:text-left sm:text-left">
                            {t("contactUsHeading")}
                        </h1>
                    </div>
                    <div>
                        <p className="text-[25px] text-[#ffeb69] leading-normal tracking-tight text-center xm:text-left sm:text-left">
                            {t("contactUsSubtitle")}
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="group flex gap-2 items-center text-[17px] font-semibold capitalize text-[#260A2F] bg-secondary rounded-full leading-tight tracking-tight px-4 py-3">
                            <Image
                                src={blackCircle}
                                alt="blackCircle"
                                width={30}
                                height={30}
                                className="group-hover:rotate-[60deg] transition-all duration-300 ease-linear"
                            />
                            <Link href={t("contactUsLink")}>
                                <TextHover
                                    titile1={t("contactUsBtn")}
                                    titile2={t("contactUsBtn")}
                                />
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
