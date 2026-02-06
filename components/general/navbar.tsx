"use client";
import Link from "next/link";
import Image from "next/image";
import { leftLinks, rightLinks, allLinks } from "@/constants";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const t = useTranslations("navbarContent");

    // STATI ESISTENTI
    const [active, setActive] = useState(false); // Usato per il menu mobile
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const currentLocale = useLocale();

    // NUOVI STATI PER LO SCROLL
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const SCROLL_THRESHOLD = 15;

    // LOGICA SCROLL
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 10) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                return;
            }
            const diff = Math.abs(currentScrollY - lastScrollY.current);
            if (diff < SCROLL_THRESHOLD) return;
            if (active) return; // Non nascondere se il menu mobile è aperto

            if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [active]);

    const onSelectChange = () => {
        const nextLocale = currentLocale === "en" ? "kh" : "en";
        startTransition(() => {
            router.replace(`/${nextLocale}`);
        });
    };

    return (
        <>
            {/* --- LAYOUT DESKTOP & HEADER FISSO --- */}
            <nav
                className={`w-screen py-4 fixed top-0 left-0 z-40 flex flex-col backdrop-blur-sm transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                {/* Top Bar (Lingua e Book Now / Hamburger) */}
                <div className="flex w-full px-4 items-center justify-between z-50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onSelectChange}
                            disabled={isPending}>
                            <Image
                                src={currentLocale === "kh" ? "/images/svg/en.svg" : "/images/svg/kh.svg"}
                                alt="Switch Language"
                                width={32}
                                height={32}
                            />
                        </button>


                    </div>

                    <Link href="booking" className="hidden lg:block h-full bg-transparent text-white border-2 border-white px-4 py-2 rounded-full capitalize hover:text-lotus-gold hover:border-lotus-gold transition-colors">
                        {t("bookNow")}
                    </Link>

                    <button
                        className="lg:hidden text-white flex flex-col"
                        onClick={() => setActive(true)}
                    >
                        <Menu size={48} />
                    </button>
                </div>

                {/* CONTAINER DESKTOP (Nascosto su mobile) */}
                <div className="hidden lg:flex w-full items-end justify-between -mt-8 z-40">
                    <div className="flex w-full justify-between ps-16 pe-8 pb-8">
                        {leftLinks.map((link) => (
                            <Link
                                key={link.id}
                                href={`/${currentLocale}${link.href}`}
                                className="text-xl text-white font-ret uppercase hover:text-lotus-gold transition-colors"
                            >
                                {t(link.title)}
                            </Link>
                        ))}
                    </div>
                    <div>
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
                    <div className="flex w-full justify-between pe-16 ps-8 pb-8">
                        {rightLinks.map((link) => (
                            <Link
                                key={link.id}
                                href={`/${currentLocale}${link.href}`}
                                className="text-xl text-white font-ret uppercase hover:text-lotus-gold transition-colors"
                            >
                                {t(link.title)}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* --- LAYOUT MOBILE MENU (DX -> SX) --- */}
            <div
                className={`fixed inset-0 z-[100] bg-lotus-dark-blue transition-transform duration-500 ease-in-out lg:hidden flex flex-col ${active ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header Mobile: X a sinistra, Logo a destra */}
                <div className="relative flex items-center justify-center p-6 w-full">
                    {/* LOGO CENTRALE */}
                    <Image
                        src="/lotus.png"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="z-10"
                    />

                    {/* TASTO CHIUDURA POSIZIONATO A DESTRA */}
                    <button
                        onClick={() => setActive(false)}
                        className="absolute right-6 text-white p-2 hover:text-lotus-gold transition-colors"
                    >
                        <X size={32} />
                    </button>
                </div>

                {/* Links Mobile Menu */}
                <div className="flex flex-col items-center justify-center flex-grow gap-6">
                    {allLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={`/${currentLocale}${link.href}`}
                            className="text-2xl text-white font-ret uppercase hover:text-lotus-gold"
                            onClick={() => setActive(false)}
                        >
                            {t(link.title)}
                        </Link>
                    ))}
                </div>

                {/* Bottom Mobile Action */}
                <div className="p-8 mt-auto">
                    <Link
                        href="booking"
                        onClick={() => setActive(false)}
                        className="flex items-center justify-center w-full bg-lotus-gold text-white  py-4 rounded-full text-xl font-ret uppercase"
                    >
                        {t("bookNow")}
                    </Link>
                </div>
            </div>
        </>
    );
}