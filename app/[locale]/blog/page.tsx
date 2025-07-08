"use client"; // Mantiene "use client" perché questa pagina gestisce lo stato di caricamento, Lenis, AnimatePresence e altre animazioni/interattività.

import Lenis from "@studio-freight/lenis"; // Per lo smooth scrolling
import { useEffect, useState, useRef } from "react"; // Aggiunto useState e useEffect per la logica di caricamento
import { AnimatePresence } from "framer-motion"; // Mantiene Framer Motion
import { useTranslations } from "next-intl"; // Per le traduzioni

// Importa i tuoi componenti UI. Assicurati che questi percorsi siano corretti.
// Ho commentato o rimosso quelli non presenti nel tuo snippet per chiarezza,
// ma dovresti riaggiungerli se li usi nella pagina.
import {
    Navbar, // Se la Navbar è presente in questa pagina
    Footer, // Se il Footer è presente in questa pagina
    Preload, // Il tuo componente di pre-caricamento
    // Hero, NotJust, VideoCta, Journey, OurWay // Componenti non specifici per il blog/slider di post
} from "@/components";

// Il componente Server che fetcha i dati e poi renderizza i post
import BlogPostFetcher from "@/components/blog-post-fetcher"; // Assicurati che questo percorso sia corretto

// Questo è il componente client che renderizza lo Swiper dei post
// Non PostRenderer. Come discusso l'ultima volta PostRenderer è il nuovo nome di Collaboration.
// Quindi il componente che visualizza lo swiper di post è PostRenderer
// Non è necessario importarlo qui se è già importato da BlogDataFetcher.

export default function BlogPage() {
    // Stato per gestire il pre-caricamento
    const [isLoading, setIsLoading] = useState(true);

    // Riferimento per Framer Motion se usato in questa pagina
    const container = useRef(null);
    const t = useTranslations("ourImpactContent"); // Per le traduzioni del testo "ourImpactHeading2"

    // Logica per Framer Motion (se applicabile agli elementi di questa pagina, non al contenuto di PostRenderer)

   

    // Effetto per Lenis e il timer di pre-caricamento
    useEffect(() => {
        // Inizializza Lenis per lo smooth scrolling
        const lenis = new Lenis();

        // Funzione per il loop di requestAnimationFrame di Lenis
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Imposta un timeout per disabilitare lo stato di caricamento dopo 2 secondi
        const timeout = setTimeout(() => {
            setIsLoading(false);
            document.body.style.cursor = "default"; // Ripristina il cursore predefinito
        }, 2000); // Durata del pre-caricamento in ms

        // Funzione di cleanup per Lenis e il timeout
        return () => {
            lenis.destroy(); // Distruggi l'istanza di Lenis per evitare memory leaks
            clearTimeout(timeout); // Cancella il timeout se il componente si smonta prima
        };
    }, []); // Esegue una sola volta al mount del componente

    return (
        // AnimatePresence gestisce l'animazione di uscita del componente Preload
        <>
            <AnimatePresence mode="wait">
                {isLoading && <Preload />}
            </AnimatePresence>

            {/* Solo renderizza il contenuto della pagina quando il caricamento è completato */}
            {!isLoading && (
                <>
                    {/* Contenitore principale della pagina, che potrebbe avere animazioni o scroll specifici */}
                    <main ref={container}> {/* Aggiunto ref={container} se Framer Motion usa questo */}
                        {/* Se la Navbar è parte di questa pagina, la metti qui */}
                        <div className="w-full min-h-20 flex flex-col items-center justify-center padding-x gap-10">
                            <Navbar />
                        </div>

                        {/* Intestazione della sezione blog */}
                        <div className="w-full flex justify-start items-center xm:pb-10 sm:pb-10">
                            <div className="w-[72%] xm:w-full sm:w-full flex flex-col gap-4 mx-auto pb-8">
                                <h1 className="mt-16 text-[80px] xm:text-[35px] sm:text-[40px] xm:leading-[40px] sm:leading-[50px] text-[#FFD7EF] font-bold leading-[80px] tracking-tighter text-center">
                                    {t("ourImpactHeading2")} {/* Titolo della sezione blog */}
                                </h1>
                            </div>
                        </div>

                        {/* Qui carichi il Server Component che fetcha i dati e renderizza lo Swiper dei post.
                            Questo componente verrà eseguito sul server, popolando l'HTML iniziale
                            anche se la pagina padre è un Client Component. */}
                        <BlogPostFetcher />

                        {/* Se il Footer è parte di questa pagina, lo metti qui */}
                        <Footer />
                    </main>
                </>
            )}
        </>
    );
}