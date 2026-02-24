import 'server-only'; // Blocca l'esecuzione lato client

export async function fetchAllMasseuses() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_CLOUD_URL || 'http://127.0.0.1:1337';
  const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_CLOUD_TOKEN

  try {
    // Costruiamo la query:
    // 1. sort=name:asc -> Ordine alfabetico
    // 2. pagination[pageSize]=100 -> Prendiamo tutti (fino a 100)
    // 3. filters[isActive][$eq]=true -> Opzionale: se hai un campo 'isActive' su Strapi per nascondere chi non lavora più
    
    const res = await fetch(`${STRAPI_URL}/api/masseuses?populate=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      // Cache Strategy:
      // Usiamo revalidate perché lo staff non cambia ogni minuto. 
      // Se cambi staff su Strapi, ci vorrà max 1 ora per vederlo o devi rebuildare.
      
    });

   
    if (!res.ok) {
      throw new Error(`Strapi error fetching masseuses: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data || [];

  } catch (error) {
    console.error("Error fetching masseuses from Strapi:", error);
    // Ritorniamo array vuoto per non rompere il frontend
    return [];
  }
}