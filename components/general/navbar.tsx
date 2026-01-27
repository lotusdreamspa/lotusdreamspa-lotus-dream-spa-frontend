"use client";
import Link from "next/link";
import Image from "next/image";
import { leftLinks, rightLinks } from "@/constants";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function Navbar() {
    const t = useTranslations("navbarContent");
    
    // STATI ESISTENTI
    const [active, setActive] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const currentLocale = useLocale();

    // NUOVI STATI PER LO SCROLL
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0); // Usiamo ref per non re-renderizzare ad ogni pixel
    const SCROLL_THRESHOLD = 15; // La costante di soglia richiesta

    // LOGICA SCROLL
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Se siamo in cima alla pagina, mostra sempre la navbar
            if (currentScrollY < 10) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                return;
            }

            // Calcola la differenza di scroll
            const diff = Math.abs(currentScrollY - lastScrollY.current);

            // Se lo spostamento è inferiore alla soglia, ignora (evita jitter)
            if (diff < SCROLL_THRESHOLD) {
                return;
            }

            // Logica principale: Scendo -> Nascondo, Salgo -> Mostro
            if (currentScrollY > lastScrollY.current) {
                setIsVisible(false); // Scroll Down
            } else {
                setIsVisible(true); // Scroll Up
            }

            // Aggiorna l'ultima posizione nota
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const onSelectChange = () => {
        const nextLocale = currentLocale === "en" ? "kh" : "en";
        startTransition(() => {
            router.replace(`/${nextLocale}`);
        });
    };

    return (
        <nav 
            className={`w-screen py-4 fixed top-0 left-0 z-50 flex flex-col backdrop-blur-sm transition-transform duration-300 ease-in-out ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >

            <div className="flex w-full px-4 items-center justify-between z-50">
                <button
                    className=""
                    onClick={onSelectChange}
                    disabled={isPending}>
                    {currentLocale === "kh" ? (
                        <Image
                            src="/images/svg/en.svg"
                            alt="Switch to English"
                            width={32}
                            height={32}
                        />) : (
                        <Image
                            src="/images/svg/kh.svg"
                            alt="Switch to Khmer"
                            width={32}
                            height={32}
                        />)
                    }
                </button>


                <Link href="booking" className="h-full bg-transparent text-white border-2 border-white px-4 py-2 rounded-full capitalize hover:text-lotus-gold hover:border-lotus-gold transition-colors">
                    {t("bookNow")}
                </Link>


            </div>
            <div className="flex w-full items-end justify-between -mt-8 z-40">

                <div className="flex w-full justify-between px-32 pb-8">
                    {leftLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={`/${currentLocale}${link.href}`}
                            className="text-2xl md:text-md xs:text-sm text-white font-ret uppercase hover:text-lotus-gold transition-colors"
                            onClick={() => setActive(!active)}>
                            {t(link.title)}
                        </Link>
                    ))}
                </div>
                <div className="">
                    <Link href="/">
                        <Image
                            src="/lotus.png"
                            alt="Lotus Dream SPA logo"
                            width={400}
                            height={400}
                            className="xm:w-[70px] sm:w-[70px]"
                        />
                    </Link>
                </div>
                <div className="flex w-full justify-between px-32 pb-8">
                    {rightLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={`/${currentLocale}${link.href}`}
                            className="text-2xl md:text-md xs:text-sm text-white font-ret uppercase hover:text-lotus-gold transition-colors"
                            onClick={() => setActive(!active)}>
                            {t(link.title)}
                        </Link>
                    ))}
                </div>

            </div>
        </nav>
    );
}