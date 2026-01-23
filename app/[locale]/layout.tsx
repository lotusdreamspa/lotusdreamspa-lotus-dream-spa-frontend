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
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const messages = await getMessages();
	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider messages={messages}>
					<ClientRenderer>
						{children}
					</ClientRenderer>
				</NextIntlClientProvider>
				<script defer src="https://umami-production-0c7c.up.railway.app/script.js" data-website-id="fc959da3-b48c-48db-bb47-cbc16800271e"></script>
			</body>
		</html>
	);
}
