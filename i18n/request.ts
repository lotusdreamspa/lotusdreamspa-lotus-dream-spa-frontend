import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Definiamo i locali supportati
const locales = ["en", "kh"];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Verifichiamo che il locale esista e sia tra quelli supportati
  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  return {
    // Usiamo "as string" o semplicemente passiamo locale ora che siamo certi che esista
    locale: locale as string, 
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});