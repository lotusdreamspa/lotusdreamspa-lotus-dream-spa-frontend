"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import PreLoad from "@/components/general/preload"; // il tuo componente Liquid
import { AnimatePresence } from "framer-motion";

export default function ClientRenderer({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const currentKey = Date.now().toString();

    useEffect(() => {
        // Ogni volta che il pathname cambia, mostriamo il loader
        setIsLoading(true);

        // Simuliamo un tempo di caricamento o attendiamo che i dati siano pronti
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Regola il tempo in base alla durata della tua transizione

        return () => clearTimeout(timer);
    }, [pathname]);

        console.log('isLoading', isLoading)
    return (
        
        <>
    
            <AnimatePresence mode="wait">
                {isLoading && <PreLoad key={currentKey} />}
            </AnimatePresence>
            {children}
        </>
    );
}