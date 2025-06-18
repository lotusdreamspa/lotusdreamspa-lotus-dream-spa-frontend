"use client";
import { useRef } from "react";
import { Words } from "@/components";
import { useTranslations } from "next-intl";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { AnimatedTextSectionProps } from "@/types";

export default function AnimatedTextSection({
  svgPath,
  translationKey,
  bgColor, // Add bgColor prop
  textColor, 
  paragraphWidth // Add paragraphWidth prop
}: AnimatedTextSectionProps) {
  const t = useTranslations(translationKey);
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 0.98]);
  const scaleSmooth = useSpring(scale);

  return (
    <motion.div
      id="animated-text-section"
      className={`w-full xm:h-fit sm:h-fit flex items-center justify-center rounded-[30px] py-10 transition-all duration-300 ease-linear mb-20 mt-48 ${bgColor || "bg-amara-gold"}`} // Use bgColor prop, with a fallback
      style={{ scale: scaleSmooth }}
      ref={container}
    >
      <div className={`${paragraphWidth || "w-[70%]"} h-full flex items-center justify-center sm:w-full xm:w-full md:w-full px-5 sm:pb-20 xm:pb-20`}>
        <Words paragraph={t("paragraph")} className={textColor || "text-white"} /> {/* Use textColor prop, with a fallback */}
      </div>
      {svgPath && (
        <div className="w-full h-full absolute">
          <div className="absolute right-24 -bottom-20">
            <motion.img
              animate={{ rotate: [-360, 360] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              }}
              src={svgPath}
              alt="rotating element"
              width={240}
              height={240}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}