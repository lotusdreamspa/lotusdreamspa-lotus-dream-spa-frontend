import TreatmentsRenderer from "@/components/renderers/treatments-renderer"; // Importa il componente client appena creato
import { Treatment } from "@/types";

// Questa funzione gira sul server.
async function getTreatments() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_CLOUD_URL}/api/treatments?populate=packages`;
    
    // QUI STA IL TRUCCO DELLA CACHE:
    // next: { revalidate: 3600 } significa "tieni in cache per 1 ora"
    const res = await fetch(url, { 
      next: { revalidate: 3600 } 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const json = await res.json();
    const treatments: Treatment[] = Array.isArray(json.data) ? json.data : [];

    // Raggruppamento dati (fatto sul server ora, alleggerisce il client)
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

// Params viene passato automaticamente da Next.js nelle page server-side
export default async function TreatmentsPage({ params }: { params: { lang: string, locale: string } }) {
  // Fetch dei dati sul server
  const treatmentsData = await getTreatments();
  
  // Gestione del locale
  // Nota: nelle server page 'params' potrebbe dover essere atteso se usi le ultime versioni di Next, 
  // ma di base qui prendiamo il valore diretto.
  const rawLocale = params?.locale || params?.lang;
  const locale = (Array.isArray(rawLocale) ? rawLocale[0] : rawLocale) || 'en';

  // Passiamo i dati al componente client
  return (
    <TreatmentsRenderer 
      treatmentsData={treatmentsData} 
      locale={locale} 
    />
  );
}