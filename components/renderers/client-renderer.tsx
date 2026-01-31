// app/[locale]/blog/BlogPageContent.tsx
"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { PreloadElement } from "@/components"; 

export default function BlogPageRenderer({
  children,
}: {
  children: React.ReactNode;
}) {
  // Stato per gestire il pre-caricamento
  const [isLoading, setIsLoading] = useState(true);
  const container = useRef(null);

  useEffect(() => {
    // Inizializza Lenis per lo smooth scrolling
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Timeout per disabilitare il pre-caricamento
    const timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
    }, 2000);

    return () => {
      lenis.destroy();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Gestione Preloader */}
      <AnimatePresence mode="wait">
        {isLoading && <PreloadElement />}
      </AnimatePresence>

      {/* Renderizza i children (la pagina vera e propria) solo quando non carica */}
      {!isLoading && (
        <main ref={container}>
          {children}
        </main>
      )}
    </>
  );
}