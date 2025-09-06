import "@/styles/globals.css";
import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
	title: "The Amara Bar and Restaurant | Best Plant based and vegetarian restaurant in Siem Reap",
	description: "The Amara Bar and Restaurant is a vegan and vegetarian restaurant in Siem Reap, Cambodia. We offer a wide range of delicious and healthy dishes made from fresh, locally sourced ingredients",
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
					{children}
				</NextIntlClientProvider>
				<script defer src="https://umami-production-0c7c.up.railway.app/script.js" data-website-id="fc959da3-b48c-48db-bb47-cbc16800271e"></script>
			</body>
		</html>
	);
}
