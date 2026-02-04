"use client";

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, MotionValue } from 'framer-motion';
import Image from 'next/image';

// ... (Interface CarouselItemData rimane uguale)
// Sposta questa definizione in alto nel file
export interface CarouselItemData {
  id: string | number;
  src: string;
  title?: string;
}

export default function Carousel({
  items = [],
  autoplay = true,
  autoplayDelay = 3000,
  loop = true,
}: { items?: CarouselItemData[], autoplay?: boolean, autoplayDelay?: number, loop?: boolean }) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Calcoliamo la larghezza dinamicamente basandoci sul contenitore Masonry
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      setContainerWidth(containerRef.current?.offsetWidth || 0);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const GAP = 40; // Ridotto leggermente per coerenza interna
  const itemWidth = containerWidth; // Ogni slide occupa ESATTAMENTE tutto il contenitore
  const trackItemOffset = itemWidth + GAP;

  const displayItems = useMemo(() => items.length > 0 ? items : [
    { id: 1, src: "/images/carousel/image1.jpg", title: "Slide 1" },
    { id: 2, src: "/images/carousel/image2.jpg", title: "Slide 2" },
    { id: 3, src: "/images/carousel/image3.jpg", title: "Slide 3" },
  ], [items]);

  const itemsForRender = useMemo(() => {
    if (!loop) return displayItems;
    return [displayItems[displayItems.length - 1], ...displayItems, displayItems[0]];
  }, [displayItems, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(loop ? -trackItemOffset : 0);

  // Sync x quando la larghezza cambia (resize)
  useEffect(() => {
    x.set(-(position * trackItemOffset));
  }, [containerWidth, trackItemOffset]);

  const activeIndex = loop ? (position - 1 + displayItems.length) % displayItems.length : position;

  const handleLoopLogic = (pos: number) => {
    if (!loop) return;
    if (pos === itemsForRender.length - 1) {
      x.jump(-trackItemOffset);
      setPosition(1);
    } else if (pos === 0) {
      x.jump(-(displayItems.length * trackItemOffset));
      setPosition(displayItems.length);
    }
  };

  const moveTo = (newPosition: number) => {
    const targetX = -(newPosition * trackItemOffset);
    animate(x, targetX, {
      type: "spring",
      stiffness: 150,
      damping: 24, // Leggermente più morbido per evitare rimbalzi visivi ai bordi
      onComplete: () => handleLoopLogic(newPosition)
    });
    setPosition(newPosition);
  };

  useEffect(() => {
    if (!autoplay || containerWidth === 0) return;
    const timer = setInterval(() => moveTo(position + 1), autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, position, trackItemOffset, containerWidth]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col overflow-hidden">
      <motion.div
        className="h-full flex items-center cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -(itemsForRender.length - 1) * trackItemOffset, right: 0 }}
        style={{ x, gap: GAP, perspective: 1000, width: "max-content" }}
        onDragStart={() => x.stop()}
        onDragEnd={(_, info) => {
          const velocity = info.velocity.x;
          const offset = info.offset.x;
          if (offset < -50 || velocity < -500) moveTo(position + 1);
          else if (offset > 50 || velocity > 500) moveTo(position - 1);
          else moveTo(position);
        }}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem 
            key={`${item.id}-${index}`} 
            item={item} 
            itemWidth={itemWidth} 
            index={index} 
            trackItemOffset={trackItemOffset} 
            x={x} 
          />
        ))}
      </motion.div>

      {/* Indicatori */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {displayItems.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "w-6 bg-lotus-gold" : "w-1.5 bg-lotus-rosewood/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function CarouselItem({ item, itemWidth, index, trackItemOffset, x }: any) {
  // Animazione di opacità e scala per nascondere le slide non attive
  const opacity = useTransform(
    x,
    [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset],
    [0.3, 1, 0.3]
  );

  const scale = useTransform(
    x,
    [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset],
    [0.9, 1, 0.9]
  );

  return (
    <motion.div
      className="relative shrink-0 overflow-hidden rounded-[20px] bg-zinc-900 shadow-2xl"
      style={{ 
        width: itemWidth, 
        height: "100%", 
        opacity,
        scale,
        transformStyle: "preserve-3d" 
      }}
    >
      <Image src={item.src} alt="img" fill className="object-cover pointer-events-none" />
    </motion.div>
  );
}