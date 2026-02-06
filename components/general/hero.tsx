import { useTranslations } from "next-intl";
import Image from "next/image";

interface HeroProps {
  // Contenuto
  title?: string;
  hasSubtitle?: boolean;       // Il testo GIGANTE animato (ex heroWord)
  subtitle?: string;           // La chiave di traduzione per il testo piccolo (ex h1)
  translationScope?: string;   // Il namespace per le traduzioni (es. "heroContent")

  // Background
  bgImg?: string;
  enableOverlay?: boolean;
  overlayClass?: string;

  // Stili
  subtitleClass?: string;      // Classi CSS per il testo piccolo (ex titleClass)
}

// components/general/hero.tsx

export default function Hero({
  title = "Lotus Dream",
  hasSubtitle = true,
  subtitle = "welcome-to-lotus-dream",
  translationScope = "heroContent",
  bgImg,
  enableOverlay = false,
  overlayClass = "bg-black/40",
  subtitleClass = "text-white",
}: HeroProps) {
  const t = useTranslations(translationScope);
  const translatedSubtitle = subtitle ? t(subtitle) : null;

  return (
    <div
      // Aggiungi 'isolate' per sicurezza, ma la logica sotto dovrebbe bastare
      className="relative flex flex-col justify-center md:justify-start w-full h-[100vh] md:h-auto overflow-hidden isolate"
    >
      {/* BACKGROUND IMAGE */}
      {bgImg && (
        <Image
          src={bgImg}
          alt="Hero background"
          fill
          // MODIFICA QUI: Rimosso z-[-20], messo z-0 (o niente se è il primo elemento absolute)
          className="object-cover z-0" 
          priority
        />
      )}

      {/* OVERLAY */}
      {bgImg && enableOverlay && (
        // MODIFICA QUI: z-1 per stare sopra l'immagine (0) ma sotto il testo (10)
        <div className={`absolute inset-0 z-[1] ${overlayClass}`} />
      )}

      {/* TITLE */}
      <h1
        // MODIFICA QUI: Aggiunto 'relative z-10' per assicurarsi che stia SOPRA immagine e overlay
        className="relative z-10 flex text-white mx-auto whitespace-wrap text-center font-agr mt-64 sm:mt-0 text-4xl lg:text-6xl xl:text-8xl leading-inherit"
      >
        {title}
      </h1>

      {/* SUBTITLE */}
      {hasSubtitle && translatedSubtitle && (
        <h2
          // MODIFICA QUI: Aggiunto 'relative z-10' anche qui
          className={`relative z-10 text-2xl xl:text-4xl mx-auto text-center w-full lg:w-3/4 font-normal lg:leading-tight lg:tracking-tight mt-24 ${subtitleClass}`}
        >
          {translatedSubtitle}
        </h2>
      )}
    </div>
  );
}