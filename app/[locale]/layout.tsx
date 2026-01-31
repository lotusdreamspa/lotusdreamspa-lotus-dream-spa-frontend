import "@/styles/globals.css";
import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import ClientRenderer from "@/components/renderers/client-renderer";


export const metadata: Metadata = {
    title: "Lotus Dream SPA | Best olistic massage and SPA in Kandal Village, Siem Reap",
    description: "Experience ultimate relaxation and rejuvenation at Lotus Dream SPA, the premier destination for holistic massage and spa treatments in Kandal Village, Siem Reap. Indulge in our luxurious services designed to soothe your body and mind.",
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // 1. Aspettiamo la risoluzione della Promise per i params
    const { locale } = await params;

    // 2. Carichiamo i messaggi per l'internazionalizzazione
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <ClientRenderer>
                        {children}
                    </ClientRenderer>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}