"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  id: string | number;
  src: string;
  title?: string;
}

interface MasonryLayoutProps {
  images: GalleryImage[];
  children: React.ReactNode;
}

export default function MasonryLayout({ images, children }: MasonryLayoutProps) {
  const [selectedImg, setSelectedImg] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (selectedImg) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedImg]);

  // Pattern di classi per il masonry desktop
  const getGridClass = (index: number) => {
    const patterns = [
      "col-span-1 row-span-1", // Indice 0
      "col-span-1 row-span-3", // Indice 2 (dopo il carousel)
      "col-span-1 row-span-2", // Indice 3
      "col-span-2 row-span-2", // Indice 4
      "col-span-1 row-span-1", // Indice 5
      "col-span-1 row-span-1", // Indice 6
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section className="bg-lotus-blue px-4 relative w-full overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 auto-rows-[160px] md:auto-rows-[220px]">

        {images.map((img, index) => (
          <React.Fragment key={img.id}>

            {/* IL CAROUSEL: Indice 1 (Desktop) / Primo posto (Mobile) */}
            {index === 1 && (
              <div className=" md:order-none col-span-2 row-span-3 md:row-span-2 flex items-center justify-center bg-white/5 rounded-[30px] md:rounded-[40px] border border-white/10 shadow-2xl overflow-hidden z-20">
                <div className="w-full h-full relative flex items-center justify-center">
                  {children}
                </div>
              </div>
            )}

            {/* IMMAGINI MASONRY */}
            <motion.div
              layoutId={`img-${img.id}`}
              onClick={() => setSelectedImg(img)}
              whileTap={{ scale: 0.95 }}
              // L'ordine naturale segue l'indice, tranne quando il carousel è order-first
              className={`relative group overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer bg-zinc-900 ${getGridClass(index)} shadow-lg`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <Image
                src={img.src}
                alt={img.title || "Gallery"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              <div className="absolute inset-0 items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 hidden md:flex">
                <span className="text-white text-xs uppercase tracking-widest font-medium">
                  {img.title}
                </span>
              </div>
            </motion.div>
          </React.Fragment>
        ))}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedImg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              className="absolute inset-0 bg-lotus-lavander/40 backdrop-blur-2xl"
            />

            <motion.div
              layoutId={`img-${selectedImg.id}`}
              className="relative w-full max-w-6xl h-[70vh] md:h-[85vh] z-10 overflow-hidden rounded-xl shadow-2xl"
            >
              <Image
                src={selectedImg.src}
                alt={selectedImg.title || "Selected"}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            <div className="fixed inset-x-0 bottom-10 md:bottom-auto md:top-10 md:right-10 md:left-auto flex justify-center md:justify-end px-10 z-[110] pointer-events-none">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={() => setSelectedImg(null)}
                className="pointer-events-auto bg-white text-black p-4 rounded-full shadow-2xl active:scale-95 transition-transform flex items-center justify-center"
              >
                <CloseIcon />
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);