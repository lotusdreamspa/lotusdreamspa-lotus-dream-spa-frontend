// lib/services.ts
import 'server-only'; // Opzionale: assicura che questo codice giri solo sul server

export async function fetchTreatmentsFromStrapi() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_CLOUD_URL || 'http://127.0.0.1:1337';
  const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_CLOUD_READ_ONLY_TOKEN;

  try {
    const res = await fetch(`${STRAPI_URL}/api/treatments?populate=packages`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // Cache condivisa tra utenti (Revalidate ogni 24h)
      next: { revalidate: 86400 } 
    });

    if (!res.ok) {
      throw new Error(`Strapi error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data || []; // Ritorniamo direttamente l'array dei dati
  } catch (error) {
    console.error('Error fetching treatments from Strapi:', error);
    return [];
  }
}