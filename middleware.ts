// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
   locales: ["en", "kh"],
   defaultLocale: "en",
   // Puoi abilitare/disabilitare il rilevamento automatico del locale
   // basato sulle preferenze del browser dell'utente.
   // localeDetection: true, // true per rilevamento automatico, false per disabilitarlo
});

export const config = {
  // Il matcher è fondamentale per dire al middleware quali percorsi deve elaborare.
  // La strategia è: cattura tutto ciò che dovrebbe essere localizzato, ed escludi
  // esplicitamente ciò che non dovrebbe.

  matcher: [
    // 1. Cattura tutti i percorsi che INIZIANO con un locale valido.
    // Esempio: /en/about-us, /kh/menu
    '/(en|kh)/:path*',

    // 2. Cattura la homepage senza locale (sarà reindirizzata a /defaultLocale/)
    // Esempio: / -> /en/
    '/',

    // 3. Cattura tutti i percorsi NON prefissati da un locale,
    // MA ESCLUDI i percorsi interni di Next.js e i tuoi asset statici.
    // Questi percorsi non prefissati (es. /about-us) verranno reindirizzati
    // al defaultLocale (es. /en/about-us).
  '/((?!_next|api|favicon.ico|.+\\.(?:jpg|jpeg|png|gif|webp|svg|mp4|mov|webm|pdf|woff|woff2|ttf|otf)).*)',
    // Ho aggiunto anche webp e gif/webm per le estensioni comuni.
  ],
};