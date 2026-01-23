// components/ui/paginator.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // <--- Importiamo Image
import { Pagination } from "@/types";

interface PaginatorProps {
  pagination: Pagination;
}

export default function Paginator({ pagination }: PaginatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = pagination.page;
  const pageCount = pagination.pageCount;

  //if (pageCount <= 1) return null;

  // Crea l'URL mantenendo i filtri esistenti
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Genera la sequenza di numeri con "..."
  const generatePageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 || 
        i === pageCount || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..." && 
        pages.length > 0
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      {/* Tasto PREV */}
      <PaginationArrow 
        direction="left" 
        href={createPageURL(currentPage - 1)} 
        isDisabled={currentPage <= 1} 
      />

      {/* Numeri Pagina */}
      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-white/50 text-lg">
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`
                min-w-[40px] h-[40px] mx-4 flex items-center justify-center rounded-full font-bold shadow-lg border-2 font-ret transition-all duration-300
                ${isCurrent 
                  ? "text-white border-white scale-125" 
                  : "text-lotus-gold scale-100 border-lotus-gold hover:text-white hover:border-white hover:scale-125"
                }
              `}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Tasto NEXT */}
      <PaginationArrow 
        direction="right" 
        href={createPageURL(currentPage + 1)} 
        isDisabled={currentPage >= pageCount} 
      />
    </div>
  );
}

// --- Componente Freccia Aggiornato ---
function PaginationArrow({ 
  direction, 
  href, 
  isDisabled 
}: { 
  direction: 'left' | 'right'; 
  href: string; 
  isDisabled: boolean; 
}) {
  // IMPOSTA QUI IL PERCORSO CORRETTO DEI TUOI SVG
  // Se sono nella root di public: "/arrowleft.svg"
  // Se sono in public/icons: "/icons/arrowleft.svg"
  const iconSrc = direction === 'left' ? "/arrow-left.svg" : "/arrow-right.svg"; 
  const label = direction === 'left' ? "Previous Page" : "Next Page";

  if (isDisabled) {
    return (
      <div className="p-3 opacity-30 cursor-not-allowed grayscale">
         <Image 
            src={iconSrc} 
            alt={label} 
            width={24} 
            height={24} 
            className="w-6 h-6"
         />
      </div>
    );
  }

  return (
    <Link 
      href={href} 
      aria-label={label}
      className="p-3 bg-white/5 rounded-full hover:bg-gold hover:scale-110 transition-all duration-300 group"
    >
      {/* Usiamo un filtro CSS (invert) o brightness se necessario per cambiare colore all'hover, 
          oppure gestisci il colore direttamente nell'SVG (fill="currentColor") */}
      <Image 
        src={iconSrc} 
        alt={label} 
        width={24} 
        height={24} 
        className="w-6 h-6 group-hover:brightness-0 group-hover:invert" // Opzionale: rende l'icona nera su sfondo oro
      />
    </Link>
  );
}