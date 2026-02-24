import 'server-only'; // Impedisce che questo codice finisca nel bundle del client

export async function fetchBookingsByDate(date: string) {
  // 1. Validazione input minima
  if (!date) {
    console.warn("fetchBookingsByDate called without a date");
    return [];
  }

  // 2. Configurazione Strapi
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_CLOUD_URL || 'http://127.0.0.1:1337';
  const STRAPI_WRITE_TOKEN = process.env.NEXT_PUBLIC_STRAPI_CLOUD_TOKEN;

  try {
    // 3. Chiamata Server-to-Server
    // Nota: 'no-store' è cruciale per i booking per evitare dati vecchi
    const res = await fetch(`${STRAPI_URL}/api/bookings?filters[date][$eq]=${date}&populate=masseuse`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_WRITE_TOKEN}`,
      },
      cache: 'no-store', 
    });

    if (!res.ok) {
      throw new Error(`Strapi error: ${res.statusText}`);
    }

    const json = await res.json();
    
    // Ritorniamo direttamente l'array dei dati (o array vuoto se null)
    return json.data || [];

  } catch (error) {
    console.error(`Error fetching bookings for date ${date}:`, error);
    // In caso di errore ritorniamo un array vuoto per non rompere la UI,
    // ma logghiamo l'errore lato server.
    return [];
  }
}

// services/bookings.ts
// ... (tieni il codice precedente fetchBookingsByDate) ...

// Aggiungi questa funzione:
export async function createBookingInStrapi(bookingData: any) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_CLOUD_URL || 'http://127.0.0.1:1337';
  const STRAPI_WRITE_TOKEN = process.env.NEXT_PUBLIC_STRAPI_CLOUD_WRITE_TOKEN; // Usa token con permessi CREATE

  try {
    console.log("createBookingInStrapi - Payload:", JSON.stringify({ data: bookingData }, null, 2));
    const res = await fetch(`${STRAPI_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_WRITE_TOKEN}`,
      },
      body: JSON.stringify({ data: bookingData }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Strapi Validation Error:", errorData);
      throw new Error(`Failed to create booking: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error creating booking in Strapi:", error);
    throw error;
  }
}