"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { arrowDown } from "@/public"; // Assicurati che questo import sia corretto

interface CtaItem {
  imgPath: string;
  translationNamespace: string;
  ctaTitle: string;
  ctaParagraph: string;
  lateralText: string;
  ctaLinkLabel?: string;
  ctaLinkHref?: string;
  skipTranslation?: boolean;
}

interface ImageCtaListProps {
  items: CtaItem[];
  imageObjectFit?: "contain" | "cover";
}

export default function ImageCtaList({ items, imageObjectFit = "contain" }: ImageCtaListProps) {
  return (
    <div className="w-full flex flex-col gap-20 py-32">
      {items.map((item, index) => {
        // Determina se l'immagine va a destra o sinistra
        const isEven = index % 2 === 0;
        const t = useTranslations(item.translationNamespace);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col lg:flex-row gap-10 w-full ${isEven ? "" : "lg:flex-row-reverse"
              }`}
          >
            {/* --- BLOCCO IMMAGINE --- */}
            {/* È FONDAMENTALE avere relative e h-[...] qui per vedere l'immagine */}
            <div className="relative w-full md:w-1/2 h-[300px] md:h-[450px] overflow-hidden">
              <Image
                src={item.imgPath}
                alt="Image Cta"
                fill
                className={`object-${imageObjectFit}`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* --- BLOCCO TESTO --- */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 px-4 md:px-10">
              <div className="flex mt-4 gap-6">

                {/* Testo Laterale (Verticale) */}
                <div className="hidden md:flex flex-col items-center gap-4 min-w-[30px]">
                  <Image src={arrowDown} alt="arrow" width={20} height={20} />
                </div>

                {/* Contenuto Principale */}
                <div className="flex flex-col gap-6">
                  <h1 className="text-2xl lg:text-4xl text-white font-light font-agr">
                    {item.skipTranslation ? item.ctaTitle : t(item.ctaTitle)}
                  </h1>
                  <h2
                    className="text-2xl md:text-4xl text-white font-light leading-tight"
                    dangerouslySetInnerHTML={{ __html: item.skipTranslation ? item.ctaParagraph : t(item.ctaParagraph) }}
                  />

                  <div className="w-fit group">
                    {item.ctaLinkHref && (
                      <Link
                        href={item.ctaLinkHref}
                        className="uppercase font-bold text-white px-4 py-2 rounded-lg bg-lotus-gold hover:bg-lotus-rosewood transition-colors duration-500"
                      >
                        {item.skipTranslation ? item.ctaLinkLabel : t(item.ctaLinkLabel || "")}
                      </Link>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}