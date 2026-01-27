"use client";

import React, { useState, useEffect } from 'react';
import { Treatment, PackageComponent } from "@/types";
import { ChevronLeft, ChevronRight, Clock, Check, Calendar as CalendarIcon, User, Mail, Phone } from "lucide-react";

// Tipi locali per la logica di prenotazione
interface Booking {
    id: string;
    date: string;
    time: string;
}

interface BookingFormProps {
    initialTreatments: Record<string, Treatment[]>;
}

const formatPrice = (amount: number) => `${amount}$`;

export default function BookingForm({ initialTreatments }: BookingFormProps) {

    // --- STATE LEVEL ---
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // --- CUSTOM SLOW SCROLL EFFECT ---
    useEffect(() => {
        const slowScrollToTop = (duration: number) => {
            const startPosition = window.scrollY;
            const startTime = performance.now();

            function animation(currentTime: number) {
                const timeElapsed = currentTime - startTime;
                let progress = timeElapsed / duration;

                // Assicuriamoci che non superi 1 (100%)
                if (progress > 1) progress = 1;

                // Funzione di "Easing" (easeInOutQuad)
                // Rende il movimento morbido: parte piano, accelera, frena alla fine.
                const ease = progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress;

                // Calcoliamo la nuova posizione Y
                window.scrollTo(0, startPosition * (1 - ease));

                // Se non abbiamo finito il tempo, continua l'animazione
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        };

        // Chiama la funzione con la durata in millisecondi
        // 1500ms = 1.5 secondi (puoi aumentare a 2000 o 3000 per farlo ancora più lento)
        slowScrollToTop(1000);

    }, [step]); // Scatta ad ogni cambio step

    // 1. Categorie per i filtri
    const categories = Object.keys(initialTreatments);

    // 2. Stato Categoria Attiva
    const [activeCat, setActiveCat] = useState(categories[0] || '');

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        name: '',
        treatment: null as Treatment | null,
        selectedPackage: null as PackageComponent | null,
        date: null as Date | null,
        time: ''
    });

    // Stato Calendario e Prenotazioni
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const MIN_NOTICE_MINUTES = parseInt(process.env.NEXT_PUBLIC_BOOKING_NOTICE_MINUTES || '60', 10);
    const MAX_CONTEMPORANY_TREATMENTS = parseInt(process.env.NEXT_PUBLIC_CONTEMPORANY_TREATMENTS || '4', 10);

    // --- EFFECT: Fetch Bookings quando cambia la data ---
    useEffect(() => {
        // Eseguiamo la fetch solo se siamo allo step 3 e abbiamo una data
        if (step === 3 && formData.date) {
            setLoadingBookings(true);
            setExistingBookings([]); // Reset immediato per evitare flicker di vecchi dati

            // Formattiamo la data YYYY-MM-DD (ISO standard)
            // .split('T')[0] è sicuro perché toISOString usa UTC. 
            // NOTA: Se l'utente è in un fuso orario molto diverso, potresti voler usare:
            // const year = formData.date.getFullYear();
            // const month = String(formData.date.getMonth() + 1).padStart(2, '0');
            // const day = String(formData.date.getDate()).padStart(2, '0');
            // const dateStr = `${year}-${month}-${day}`;
            const dateStr = formData.date.toISOString().split('T')[0];

            // Chiamiamo la NOSTRA api interna (/app/api/bookings/route.ts)
            fetch(`/api/bookings?date=${dateStr}`)
                .then(res => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((json) => {
                    // La nostra API Route restituisce { data: [...] }
                    const rawData = json.data || [];

                    const mappedBookings: Booking[] = rawData.map((item: any) => ({
                        id: item.id?.toString() || 'temp-id',
                        // Supporto ibrido per Strapi v4 (attributes) e v5 (flat)
                        date: item.attributes?.date || item.date,
                        time: item.attributes?.time || item.time
                    }));

                    setExistingBookings(mappedBookings);
                })
                .catch(err => {
                    console.error("Error fetching bookings:", err);
                    setExistingBookings([]);
                })
                .finally(() => setLoadingBookings(false));
        }
    }, [step, formData.date]);

    // --- HANDLERS ---
    const nextStep = () => setStep((p) => p + 1);
    const prevStep = () => setStep((p) => p - 1);

    // --- RENDERERS ---

    // STEP 1: CONTACT
    const renderStep1 = () => (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-lg mx-auto">
            <div className="bg-white/5 border border-lotus-gold/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                <h2 className="text-3xl font-agr text-white mb-6 text-center">Contact Details</h2>
                <div className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-lotus-bronze" size={18} />
                        <input
                            type="email" required placeholder="Email Address *"
                            className="w-full bg-lotus-blue/50 border border-lotus-gold/30 rounded pl-10 p-3 text-white focus:border-lotus-gold outline-none placeholder:text-gray-500"
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-lotus-bronze" size={18} />
                        <input
                            type="tel" required placeholder="Phone Number *"
                            className="w-full bg-lotus-blue/50 border border-lotus-gold/30 rounded pl-10 p-3 text-white focus:border-lotus-gold outline-none placeholder:text-gray-500"
                            value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-lotus-bronze" size={18} />
                        <input
                            type="text" placeholder="Your Name (Optional)"
                            className="w-full bg-lotus-blue/50 border border-lotus-gold/30 rounded pl-10 p-3 text-white focus:border-lotus-gold outline-none placeholder:text-gray-500"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <button
                        disabled={!formData.email || !formData.phone}
                        onClick={nextStep}
                        className="w-full mt-4 bg-lotus-gold text-lotus-blue font-bold py-3 rounded hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );

    // STEP 2: TREATMENT
    const renderStep2 = () => {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-5xl">

                {/* 1. HEADER */}
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-agr text-white mb-6">Select Treatment</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCat(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all uppercase tracking-wider
                                    ${activeCat === cat ? 'bg-lotus-gold text-lotus-blue font-bold shadow-lg' : 'border border-lotus-gold/30 text-lotus-bronze hover:border-lotus-gold hover:text-white'}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. AREA SCROLLABILE */}
                <div className="pr-2 pb-8 border-t border-white/5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {initialTreatments[activeCat]?.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => {
                                    if (formData.treatment?.id === t.id) {
                                        setFormData(prev => ({ ...prev, treatment: null, selectedPackage: null }));
                                    } else {
                                        setFormData(prev => ({ ...prev, treatment: t, selectedPackage: null }));
                                    }
                                }}
                                className={`p-6 rounded-lg border transition-all cursor-pointer relative group
                                    ${formData.treatment?.id === t.id ? 'border-lotus-gold bg-white/10 shadow-lg' : 'border-white/10 hover:border-white/40 bg-white/5'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold text-white group-hover:text-lotus-gold transition-colors">{t.title}</h3>
                                    {formData.treatment?.id === t.id && <div className="bg-lotus-gold rounded-full p-1"><Check size={14} className="text-lotus-blue" /></div>}
                                </div>
                                <p className="text-sm text-gray-300 line-clamp-2 mb-4 leading-relaxed">{t.description}</p>

                                {formData.treatment?.id === t.id && (
                                    <div className="mt-4 space-y-2 animate-in zoom-in-95 duration-300">
                                        <div className="h-px w-full bg-white/10 mb-3"></div>
                                        <p className="text-xs text-lotus-bronze uppercase font-bold tracking-widest mb-2">Duration Options</p>
                                        {t.packages?.sort((a, b) => a.minutes - b.minutes).map(pkg => (
                                            <button
                                                key={pkg.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, treatment: t, selectedPackage: pkg }));
                                                }}
                                                className={`w-full flex justify-between items-center p-3 rounded text-sm transition-all
                                                    ${formData.selectedPackage?.id === pkg.id ? 'bg-lotus-gold text-lotus-blue font-bold shadow-md transform scale-[1.02]' : 'bg-black/20 text-white hover:bg-white/10'}
                                                `}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    <span>{pkg.minutes} Minutes</span>
                                                </div>
                                                <span>{formatPrice(pkg.discountedPrice || pkg.price)}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. FOOTER */}
                <div className="pt-6 mt-4 border-t border-white/10 flex justify-between">
                    <button onClick={prevStep} className="text-white hover:text-lotus-gold underline underline-offset-4 transition-colors">Back</button>
                    <button
                        disabled={!formData.selectedPackage}
                        onClick={nextStep}
                        className="bg-lotus-gold text-lotus-blue font-bold py-3 px-8 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
                    >
                        Choose Date
                    </button>
                </div>
            </div>
        );
    };

    // STEP 3: DATE & TIME
    const renderStep3 = () => {
        const today = new Date();

        const now = new Date();
        // Logica Calendario
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        // Slots
        const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-5xl flex flex-col md:flex-row gap-8">
                {/* Calendar Column */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-agr text-white mb-6">Select Date</h3>
                    <div className="bg-white/5 border border-lotus-gold/20 rounded-lg p-6 shadow-xl backdrop-blur-sm">
                        <div className="flex justify-between items-center text-white mb-6 px-2">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="hover:text-lotus-gold transition-colors"><ChevronLeft /></button>
                            <span className="font-bold text-lg">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="hover:text-lotus-gold transition-colors"><ChevronRight /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center mb-4">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-xs text-lotus-bronze font-bold uppercase">{d}</span>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array(firstDayIndex).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                            {days.map(d => {
                                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                                const isSelected = formData.date?.toDateString() === dateObj.toDateString();
                                const isPast = dateObj < new Date(today.setHours(0, 0, 0, 0));
                                return (
                                    <button
                                        key={d}
                                        disabled={isPast}
                                        onClick={() => setFormData({ ...formData, date: dateObj, time: '' })}
                                        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all
                                            ${isSelected ? 'bg-lotus-gold text-lotus-blue font-bold shadow-lg scale-110' : 'text-white hover:bg-white/20'}
                                            ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {d}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Slots Column */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-agr text-white mb-6">Select Time</h3>
                    {!formData.date ? (
                        <div className="h-full max-h-80 flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg text-gray-500 bg-white/5">
                            Please select a date first
                        </div>
                    ) : loadingBookings ? (
                        <div className="h-full max-h-80 flex items-center justify-center text-lotus-gold animate-pulse bg-white/5 rounded-lg">Checking availability...</div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map(time => {
                                const isFull = existingBookings.filter(b => b.time === time).length >= MAX_CONTEMPORANY_TREATMENTS;
                                let isTooClose = false;
                                const cutoffTime = new Date(now.getTime() + MIN_NOTICE_MINUTES * 60000);

                                // Verifichiamo se la data selezionata è "Oggi"
                                const isToday = formData.date &&
                                    formData.date.getDate() === today.getDate() &&
                                    formData.date.getMonth() === today.getMonth() &&
                                    formData.date.getFullYear() === today.getFullYear();

                           
                                if (isToday && formData.date) {
                                    // Creiamo un oggetto data per questo specifico slot
                                    if (formData.date) {
                                        // Costruiamo la data specifica di QUESTO slot
                                        // Prendiamo anno/mese/giorno dalla selezione
                                        const slotTime = new Date(formData.date);
                                        const [hours] = time.split(':').map(Number);
                                        // Impostiamo l'ora dello slot
                                        slotTime.setHours(hours, 0, 0, 0);

                                        // LOGICA SEMPLIFICATA E CORRETTA:
                                        // Confrontiamo semplicemente il timestamp assoluto dello slot con il timestamp limite.
                                        // Funziona sia per oggi che per il passato (se selezioni ieri per errore, blocca tutto).
                                        if (slotTime < cutoffTime) {
                                            isTooClose = true;
                                        }
                                    }
                                }

                                const isDisabled = isFull || isTooClose;
                                const isSelected = formData.time === time;

                                return (
                                    <button
                                        key={time}
                                        disabled={isDisabled}
                                        onClick={() => setFormData({ ...formData, time })}
                                        className={`py-4 rounded border text-sm transition-all relative font-medium
                                            ${isSelected ? 'bg-lotus-gold border-lotus-gold text-lotus-blue shadow-md' : 'border-lotus-gold/30 text-white hover:border-lotus-gold hover:bg-white/5'}
                                            ${isDisabled ? 'opacity-30 cursor-not-allowed bg-black/40 border-transparent grayscale' : ''}
                                        `}
                                    >
                                        {time}
                                        {/* Label specifica per il motivo della disabilitazione */}
                                        {isFull && <span className="absolute right-[20%] bottom-[5%] -translate-x-1/2 -translate-y-1/2 text-[10px] bg-red-500/80 text-white px-1 rounded whitespace-nowrap">Full</span>}
                                        {isTooClose && !isFull && <span className="absolute right-[20%] bottom-[5%] -translate-x-1/2 -translate-y-1/2 text-[10px] bg-gray-600 text-white px-1 rounded whitespace-nowrap">Too late</span>}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="w-full flex justify-between mt-auto pt-8 border-t border-white/10 col-span-full">
                    <button onClick={prevStep} className="text-white hover:text-lotus-gold underline underline-offset-4 transition-colors">Back</button>
                    <button
                        disabled={!formData.date || !formData.time}
                        onClick={nextStep}
                        className="bg-lotus-gold text-lotus-blue font-bold py-3 px-10 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
                    >
                        Review Booking
                    </button>
                </div>
            </div>
        );
    };

    // STEP 4: RECAP
    const renderStep4 = () => (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-2xl bg-white/5 border border-lotus-gold/20 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-agr text-white mb-8 text-center">Confirm Reservation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white mb-8">
                <div className="space-y-1">
                    <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-2">Guest Info</p>
                    <div className="text-xl font-medium">{formData.name || 'Guest'}</div>
                    <div className="text-gray-400 text-sm flex items-center gap-2"><Mail size={14} /> {formData.email}</div>
                    <div className="text-gray-400 text-sm flex items-center gap-2"><Phone size={14} /> {formData.phone}</div>
                </div>
                <div className="space-y-1">
                    <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-2">Date & Time</p>
                    <div className="flex items-center gap-2 text-lg font-medium"><CalendarIcon size={18} className="text-lotus-gold" /> {formData.date?.toLocaleDateString()}</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-white"><Clock size={20} className="text-lotus-gold" /> {formData.time}</div>
                </div>
                <div className="md:col-span-2 border-t border-white/10 pt-6 mt-2">
                    <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-2">Treatment Selected</p>
                    <div className="flex justify-between items-end bg-white/5 p-4 rounded border border-white/10">
                        <div>
                            <div className="text-xl font-semibold text-lotus-gold">{formData.treatment?.title}</div>
                            <div className="text-gray-400 mt-1">{formData.selectedPackage?.minutes} Minutes Session</div>
                        </div>
                        <div className="text-3xl font-agr text-white">
                            {formData.selectedPackage && formatPrice(formData.selectedPackage.discountedPrice || formData.selectedPackage.price)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <button onClick={prevStep} className="text-white hover:text-lotus-gold underline underline-offset-4 transition-colors">Modify Details</button>
                <button
                    disabled={isSubmitting}
                    onClick={async () => {
                        setIsSubmitting(true);
                        try {
                            const payload = {
                                ...formData,
                                date: formData.date?.toISOString().split('T')[0]
                            };

                            const response = await fetch('/api/bookings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });

                            if (!response.ok) {
                                const err = await response.json();
                                throw new Error(err.error || "Booking failed");
                            }

                            // Successo!
                            alert("Booking Confirmed! We sent you an email.");
                            // Qui potresti reindirizzare: router.push('/thank-you')
                            // O resettare il form

                        } catch (error) {
                            console.error(error);
                            alert("Something went wrong. Please try again or contact us.");
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                    className={`bg-lotus-gold hover:bg-white text-lotus-blue font-bold py-3 px-12 rounded shadow-lg transform hover:scale-105 transition-all flex items-center gap-2
        ${isSubmitting ? 'opacity-70 cursor-wait' : ''}
    `}
                >
                    {isSubmitting ? (
                        <>Processing...</> // Magari metti uno spinner qui
                    ) : (
                        <>
                            <Check size={20} />
                            Confirm Booking
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-12 w-full max-w-xs justify-center">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-full bg-lotus-gold' : 'w-full bg-white/20'}`} />
                ))}
            </div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
        </div>
    );
}