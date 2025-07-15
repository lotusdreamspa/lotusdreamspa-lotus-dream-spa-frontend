import { Marquee } from "@/components";
import { useTranslations } from "next-intl";

export default function NotJust() {
    const t = useTranslations("notJustContent");
    return (
        <>
            <Marquee
                className="text-amara-gold"
                titile1="Be"
                titile2="Fair"
            />
            <div className="w-full py-20 flex justify-center items-center padding-x">
                <div className="w-[70%] xm:w-full sm:w-full flex flex-col gap-10">
                    <div>
                        <h1 className="text-[70px] xm:text-[35px] sm:text-[40px] xm:leading-none sm:leading-none text-[#ffeb69] font-bold leading-[60px] tracking-tight">
                            {t("notJustHeading")}
                        </h1>
                    </div>
                    <div>
                        <p className="text-[23px] text-amara-gold leading-normal tracking-tight">
                            {t("notJustPara")}
                        </p>
                    </div>
                    <div>
                        <p className="text-[23px]  text-amara-gold leading-normal tracking-tight">
                            {t("notJustPara1")}
                        </p>
                    </div>
                    <div>
                        <p className="text-[23px]  text-amara-gold leading-normal tracking-tight">
                            {t("notJustPara2")}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
