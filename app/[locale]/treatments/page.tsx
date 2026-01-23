// app/[locale]/menu/page.tsx (o treatments/page.tsx)

import {
  NavbarElement,
  HeroElement,
  FooterElement,
} from "@/components";
// Importiamo il componente client (che ora è "leggero")
import TreatmentsRenderer from "@/components/renderers/treatments-renderer";
import { Treatment } from "@/types";

// --- FETCHING DATI (Server Side) ---
async function getTreatments() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_CLOUD_URL}/api/treatments?populate=packages`;

    // Cache per 24 ore
    const res = await fetch(url, {
      next: { revalidate: 86400 }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const json = await res.json();
    const treatments: Treatment[] = Array.isArray(json.data) ? json.data : [];

    // Raggruppamento dati
    const grouped = treatments.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {} as Record<string, Treatment[]>);

    return grouped;
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return {};
  }
}

// --- COMPONENTE DI PAGINA ---
export default async function TreatmentsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // 1. Fetch dei dati
  const treatmentsData = await getTreatments();

  // 2. Render della struttura
  return (
    <>
      {/* Wrapper principale con lo stile di background condiviso */}
      <div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
        <NavbarElement />
        <HeroElement title="Treatments" translationScope="treatmentsContent" subtitle="find-the-perfect-escape" />
      </div>
      <TreatmentsRenderer
        treatmentsData={treatmentsData}
        locale={locale}
      />
      <FooterElement />
    </>
  );
}