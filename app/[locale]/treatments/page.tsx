import {
  NavbarElement,
  HeroElement,
  FooterElement,
} from "@/components";
import TreatmentsRenderer from "@/components/renderers/treatments-renderer";
// 1. Importa il Service
import { fetchTreatmentsFromStrapi } from "@/services/treatments"; 
import { Treatment } from "@/types";

// --- LOGICA DI TRASFORMAZIONE (Data Transformation Layer) ---
async function getGroupedTreatments() {
  try {
    // 2. Chiamata al Service condiviso (Gestisce Auth, URL e Cache)
    const treatments = await fetchTreatmentsFromStrapi();

    // 3. Raggruppamento dati (Logica specifica per questa pagina)
    const grouped = treatments.reduce((acc: { [x: string]: any[]; }, curr: { category: string; }) => {
      const rawCat = curr.category || 'Other';
      const cat = rawCat.trim(); 
      
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {} as Record<string, Treatment[]>);

    return grouped;

  } catch (error) {
    console.error("Error organizing treatments data:", error);
    return {};
  }
}

// --- COMPONENTE DI PAGINA ---
export default async function TreatmentsPage({
  params
}: {
 params: Promise<{ locale: string }>;
}) {
  // 4. Fetch + Trasformazione dei dati
  const treatmentsData = await getGroupedTreatments();
  const { locale } = await params;

  
  return (
    <>
      <div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
        <NavbarElement />
        <HeroElement 
            title="Treatments" 
            translationScope="treatmentsContent" 
            subtitle="find-the-perfect-escape" 
        />
      </div>
      
      {/* Passiamo i dati al componente client */}
      <TreatmentsRenderer
        treatmentsData={treatmentsData}
        locale={locale}
      />
      
      <FooterElement />
    </>
  );
}