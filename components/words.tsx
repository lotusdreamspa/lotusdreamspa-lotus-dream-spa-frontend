"use client";
import React, { useRef } from "react";
import { TParagraphProps, TWordProps } from "@/types";
import { motion, useScroll, useTransform } from "framer-motion";

// Update the type definition to include minOffset and maxOffset
type ParagraphPropsWithClassName = TParagraphProps & {
    className?: string;
    minOffset?: number; // New prop for scroll start offset
    maxOffset?: number; // New prop for scroll end offset
};

export default function Paragraph({
    paragraph,
    className,
    minOffset = 0.9, // Default value for start offset
    maxOffset = 0.15, // Default value for end offset
}: ParagraphPropsWithClassName) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        // Use props directly in the offset array
        offset: [`start ${minOffset}`, `start ${maxOffset}`],
    });

    const words = paragraph.split(" ");
    return (
        <>
            <p
                ref={container}
                className={`text-[100px] lg:text-[70px] md:text-[60px] xm:text-[36px] sm:text-[40px] text-[#260A2F] font-bold leading-none tracking-tight text-center flex flex-wrap items-center justify-center${className ? ` ${className}` : ""}`}>
                {words.map((word, i) => {
                    const start = i / words.length;
                    const end = start + 1 / words.length;
                    return (
                        <Words
                            key={i}
                            progress={scrollYProgress}
                            range={[start, end]}>
                            {word}
                        </Words>
                    );
                })}
            </p>
        </>
    );
}

const Words = ({ children, progress, range }: TWordProps) => {
    const opacity = useTransform(progress, range, [0, 1]);
    return (
        <span className="relative mr-[12px] mt-[12px]">
            <span className="absolute opacity-0">{children}</span>
            <motion.span style={{ opacity: opacity }}>{children}</motion.span>
        </span>
    );
};