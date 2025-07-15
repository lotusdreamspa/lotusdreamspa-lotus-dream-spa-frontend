"use client";

import Link from "next/link";
import { Words } from "@/components";
import { useTranslations } from "next-intl";
import { ParagraphProps } from "@/types";
import { TextHover } from "@/components";

export default function Paragraph({
    translationKey,
    bgColor, // Add bgColor prop
    textColor,
    paragraphWidth,
    buttonLabel,
    buttonLabel2,
    buttonHref,
    buttonBgColor,
    buttonTextColor, 
    numberOfParagraphs // Add paragraphWidth prop
}: ParagraphProps) {
    const t = useTranslations(translationKey);

    return (
        <div
            id="paragraph"
            className={`w-full xm:h-fit sm:h-fit py-10 mb-20 mt-48 ${bgColor || "bg-amara-gold"}`} // Use bgColor prop, with a fallback
        >
            <div className={`${paragraphWidth || ""} sm:pb-20 xm:pb-20 mx-auto`}>
                {/* Use the numberOfParagraphs prop to determine how many paragraphs to render */}
                {Array.from({ length: numberOfParagraphs || 1 }).map((_, index) => (
                    <div key={index} className="w-full flex flex-col items-center justify-center mb-8">
                        <Words paragraph={t(`paragraph-${index + 1}`)} className={textColor || "text-white"} minOffset={0.6} maxOffset={0.3}/> 
                    </div>
                ))}
                {/* Use textColor prop, with a fallback */}
            </div>

            {buttonLabel && buttonHref && (
                <div className="w-full flex items-center justify-center mt-5">
                    <div className={`group flex gap-2 items-center text-[17px] font-semibold capitalize ${buttonTextColor || "text-[#260A2F]"} ${buttonBgColor || "bg-secondary"} rounded-full leading-tight tracking-tight px-4 py-3`}>
                        <Link href={buttonHref} className="w-36">
                            <TextHover
                                titile1={buttonLabel}
                                titile2={buttonLabel2 || "Let's Go!"} 
                      
                            />
                        </Link>
                    </div>
                    
                </div>
            )}
        </div>
    );
}