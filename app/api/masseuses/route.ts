import { NextResponse } from 'next/server';
import { fetchAllMasseuses } from '@/services/masseuses'; // Assicurati che il path sia corretto

export async function GET() {
  try {
    // 1. Chiamiamo il servizio (Server-side logic)
    const masseuses = await fetchAllMasseuses();

    // 2. Ritorniamo i dati al client
    // Avvolgiamo in un oggetto { data: ... } per mantenere coerenza con la struttura standard
    return NextResponse.json({ data: masseuses });

  } catch (error) {
    console.error("API Route Error (Masseuses):", error);
    return NextResponse.json(
      { error: 'Failed to fetch therapist list' },
      { status: 500 }
    );
  }
}