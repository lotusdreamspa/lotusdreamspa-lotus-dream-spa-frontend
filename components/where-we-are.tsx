import { useTranslations } from "next-intl";
import { Marquee } from "@/components";

export default function WhereWeAre() {
    const t = useTranslations("footerContent");
    return (
        <>
            <div
                id="find-us"
                className="w-full h-screen flex flex-col items-center padding-x justify-between pt-5">
                <Marquee
                    titile1="Find"
                    titile2="Us"
                    className="text-[#ffeb69]"
                />
                <div className="w-[80%] flex flex-col gap-10 xm:w-full sm:w-full">


                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.909463185598!2d103.85378642479922!3d13.355905456336851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311017dcaa9040d9%3A0x4edae835d38d891c!2sThe%20Amara%20Bar%20and%20Restaurant!5e0!3m2!1sit!2skh!4v1748435865525!5m2!1sit!2skh"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-[400px] rounded-lg shadow-lg border-0"
                    />
                </div>
            </div>
        </>
    );
}
