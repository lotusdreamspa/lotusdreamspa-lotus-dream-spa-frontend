import { NextResponse } from 'next/server';
import { fetchBookingsByDate, createBookingInStrapi } from '@/services/bookings';
import { findOrCreateCustomer } from '@/services/customers';

// GET: Recupera prenotazioni (Resta invariato)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

  const data = await fetchBookingsByDate(date);
  console.log(data, 'dentro api')
  return NextResponse.json({ data });
}

// POST: Crea Customer + Booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
   
    // Destrutturiamo i dati che arrivano dal frontend (BookingForm)
    const { 
      name, 
      email, 
      phone,
      isKhmer, 
      date, // Formato "YYYY-MM-DD"
      time, // Formato "HH:mm" (es. "14:00")
      treatment, // Oggetto intero del trattamento
      selectedPackage, // Oggetto del pacchetto selezionato (prezzo, minuti)
      masseuseDocId,
      bookingStatus,
      notes
    } = body;

    const isContactMode = bookingStatus === 'created';

    // 1. Validazione base
    // Se è contact mode, non richiediamo treatment e selectedPackage
    if (!email || !date || (!isContactMode && (!time || !treatment || !selectedPackage))) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Trova o Crea il Cliente
    const customer = await findOrCreateCustomer({ name, email, phone, isKhmer });

    if (!customer || !customer.id) {
        throw new Error("Failed to resolve customer ID");
    }

    // 3. Calcolo dei valori corretti per lo schema Strapi
    const finalPrice = selectedPackage ? (selectedPackage.discountedPrice || selectedPackage.price) : 0;
    const duration = selectedPackage ? selectedPackage.minutes : 0;

    // 4. Prepara payload ESATTO per il tuo schema Strapi
    const bookingPayload: any = {
      date: date, 
      time: time && time.length === 5 ? `${time}:00` : (time || "00:00:00"), 
      
      duration: duration, 
      price: finalPrice,  
      
      customer: customer.documentId,
      masseuse: masseuseDocId,
      
      bookingStatus: bookingStatus || 'confirmed', 
      
      notes: notes || `Booked via Web from the customer.`
    };

    if (treatment?.documentId) {
        bookingPayload.treatment = treatment.documentId;
    }
    
    console.log("API Route - Customer:", JSON.stringify(customer, null, 2));
    console.log("API Route - Booking Payload:", JSON.stringify(bookingPayload, null, 2));

    // 5. Crea la prenotazione
    const newBooking = await createBookingInStrapi(bookingPayload);

    return NextResponse.json({ success: true, booking: newBooking });

  } catch (error: any) {
    console.error('API Booking Error:', error);
    // Gestione errore Strapi più dettagliato
    const errorMessage = error.message || 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}