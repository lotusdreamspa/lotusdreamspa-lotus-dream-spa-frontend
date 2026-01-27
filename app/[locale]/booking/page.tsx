// app/booking/page.tsx (o dove si trova il tuo file)
import { NavbarElement, HeroElement, FooterElement } from "@/components";
import BookingForm from "@/components/renderers/booking-form";
import { Treatment } from "@/types";
import { fetchTreatmentsFromStrapi } from "@/services/treatments"; // <--- Importa la funzione

// Funzione per raggruppare i dati (Business Logic)
async function getGroupedTreatments() {
  // Chiamata DIRETTA alla funzione (niente fetch HTTP inutile verso /api/treatments)
  const treatments = await fetchTreatmentsFromStrapi(); 

  // Raggruppamento dati
  const grouped = treatments.reduce((acc: any, curr: Treatment) => {
    const cat = curr.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {} as Record<string, Treatment[]>);

  return grouped;
}

export default async function BookingPage() {
    // Eseguiamo il fetch lato server
    const groupedTreatments = await getGroupedTreatments();

    return (
        <>
            <div className="bg-lotus-blue w-full flex flex-col">
                <NavbarElement />
            </div>

            <div className="flex-grow flex flex-col items-center justify-start px-4 pb-20 mt-64">
                {/* Passiamo i dati al Client Component */}
                <BookingForm initialTreatments={groupedTreatments} />
            </div>
            
            <FooterElement />
        </>
    );
}