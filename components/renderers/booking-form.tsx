"use client";

import React, { useState, useEffect } from 'react';
import { Treatment, PackageComponent } from "@/types"; // Assicurati che i path siano corretti
import { ChevronLeft, ChevronRight, Clock, Check, Calendar as CalendarIcon, User, Mail, Phone, Globe, Trash2, X } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Booking } from '@/types';

interface BookingFormProps {
    initialTreatments: Record<string, Treatment[]>;
}

// --- HELPER CRUCIALE PER LE DATE (SOLUZIONE TIMEZONE) ---
const getLocalISOString = (dateInput: Date | string | null): string => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function BookingForm({ initialTreatments }: BookingFormProps) {
    // --- STATE LEVEL ---
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [persons, setPersons] = useState(1);

    // Gestione selezioni multiple
    const [selections, setSelections] = useState<{ id: string; treatment: Treatment; pkg: PackageComponent }[]>([]);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [triggerGlow, setTriggerGlow] = useState(false);

    // NUOVO STATO: Mappa l'indice della selezione (0, 1, 2...) all'oggetto Massaggiatrice
    const [assignedMasseuses, setAssignedMasseuses] = useState<Record<number, any>>({});
    const [calculatingAssignment, setCalculatingAssignment] = useState(false);

    // Categories
    const categories = Object.keys(initialTreatments);
    const [activeCat, setActiveCat] = useState(categories[0] || '');

    // Form Data - [FIX] Aggiunto 'duration' nello stato iniziale
    const [formData, setFormData] = useState({
        isKhmer: false,
        email: '',
        phone: '',
        name: '',

        // Dati Selezione
        treatment: null as Treatment | null, // Trattamento attualmente "aperto" nella UI

        // [FIX CRUCIALE] La durata che guida il calendario.
        // Viene aggiornata ogni volta che si aggiunge una selezione.
        duration: 60,

        date: null as Date | null,
        time: ''
    });

    // Calendar & Bookings State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false)

    // Env vars
    const MIN_NOTICE_MINUTES = parseInt(process.env.NEXT_PUBLIC_BOOKING_NOTICE_MINUTES || '60', 10);
    const MAX_CONTEMPORANY_TREATMENTS = parseInt(process.env.NEXT_PUBLIC_CONTEMPORANY_TREATMENTS || '4', 10);

    // URL Logic
    const pathname = usePathname();
    useEffect(() => {
        if (!pathname) return;
        const isKhmerURL = pathname.startsWith('/kh');
        setFormData(prev => ({ ...prev, isKhmer: isKhmerURL }));
    }, [pathname]);

        // --- SCROLL EFFECT ---
    useEffect(() => {
        const slowScrollToTop = (duration: number) => {
            const startPosition = window.scrollY;
            const startTime = performance.now();
            function animation(currentTime: number) {
                const timeElapsed = currentTime - startTime;
                let progress = timeElapsed / duration;
                if (progress > 1) progress = 1;
                const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                window.scrollTo(0, startPosition * (1 - ease));
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            requestAnimationFrame(animation);
        };
        if (step > 1) slowScrollToTop(1000);
    }, [step]);

    const removeSelection = (indexToRemove: number) => {
        setTriggerGlow(true);
        setSelections(prev => {
            const newSelections = prev.filter((_, i) => i !== indexToRemove);

            // [FIX] Se rimuoviamo tutto, resettiamo la durata a 60
            // Se rimane qualcosa, aggiorniamo la durata con quella del primo elemento rimasto
            const nextDuration = newSelections.length > 0 ? newSelections[0].pkg.minutes : 60;
            setFormData(f => ({ ...f, duration: nextDuration }));

            return newSelections;
        });
        const timer = setTimeout(() => {
            setTriggerGlow(false);
        }, 500); // 0.5 secondi di durata

        // Cleanup del timer se il componente viene smontato o l'effetto rieseguito rapidamente
        return () => clearTimeout(timer);
    };

    const addSelection = (treatment: Treatment, pkg: PackageComponent) => {
        setTriggerGlow(true);
        if (selections.length < persons) {
            setSelections(prev => [...prev, { id: `${Date.now()}`, treatment, pkg }]);

            // [FIX CRUCIALE] Aggiorniamo IMMEDIATAMENTE la durata nel formData
            // Usiamo la durata dell'ultimo pacchetto aggiunto (o la logica che preferisci, es. il massimo)
            // Qui assumiamo che per gruppi si tenda a fare trattamenti di lunghezza simile o che l'ultimo comandi.
            setFormData(prev => ({
                ...prev,
                duration: pkg.minutes
            }));
        }
        const timer = setTimeout(() => {
            setTriggerGlow(false);
        }, 500); // 0.5 secondi di durata

        // Cleanup del timer se il componente viene smontato o l'effetto rieseguito rapidamente
        return () => clearTimeout(timer);
    };

    // --- AUTO-TRIM SELECTIONS ---
    // Se l'utente riduce il numero di persone (es. da 4 a 2), 
    // tagliamo automaticamente le selezioni in eccesso mantenendo le prime.
    useEffect(() => {
        if (selections.length > persons) {
            // 1. Tagliamo l'array mantenendo solo i primi N elementi
            const trimmedSelections = selections.slice(0, persons);
            setSelections(trimmedSelections);

            // 2. [IMPORTANTE] Sincronizziamo la durata
            // Se dopo il taglio rimane qualcosa, usiamo la durata del primo pacchetto rimasto.
            // Se non rimane nulla, resettiamo a 60.
            const nextDuration = trimmedSelections.length > 0 ? trimmedSelections[0].pkg.minutes : 60;

            setFormData(prev => ({ ...prev, duration: nextDuration }));
        }
    }, [persons, selections]);


    const formatPrice = (priceUsd: number) => {
        if (formData.isKhmer) {
            return `${(priceUsd * 4000).toLocaleString('en-US')} ៛`;
        }
        return `$ ${priceUsd}`;
    };

    const currentTotal = selections.reduce((acc, curr) => acc + (curr.pkg.discountedPrice || curr.pkg.price), 0);

    // --- STEP 3: FETCH BOOKINGS (VERSIONE BLINDATA) ---
    useEffect(() => {
        if (step === 3 && formData.date) {
            setLoadingBookings(true);
            setExistingBookings([]);

            const dateStr = getLocalISOString(formData.date);
            console.log(`Fetching bookings for: ${dateStr}`);

            fetch(`/api/bookings?date=${dateStr}`)
                .then(res => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then((json) => {
                    const rawData = json.data || [];

                    const mappedBookings: Booking[] = rawData.map((item: any) => {
                        const attrs = item.attributes || item;

                        // [FIX ROBUSTEZZA DATI]
                        // Cerchiamo duration ovunque: item.duration, attrs.duration, etc.
                        let rawDuration = attrs.duration ?? item.duration;

                        // Conversione sicura in numero
                        const cleanDuration = Number(rawDuration);

                        // Fallback a 60 solo se il dato è mancante o 0
                        const finalDuration = (cleanDuration > 0) ? cleanDuration : 60;

                        return {
                            id: item.id?.toString() || 'temp-id',
                            documentId: item.documentId || item.id?.toString(),

                            date: attrs.date,
                            time: attrs.time,

                            // Assegniamo la durata pulita
                            duration: finalDuration,

                            price: Number(attrs.price) || 0,
                            bookingStatus: attrs.bookingStatus || 'confirmed',

                            treatment: attrs.treatment,
                            customer: attrs.customer,
                            masseuse: attrs.masseuse
                        };
                    });

                    // Debug: Controlla la console per vedere se le durate sono 120, 90, etc.
                    // console.log("✅ Mapped Bookings (Snapshot):", JSON.parse(JSON.stringify(mappedBookings)));
                    setExistingBookings(mappedBookings);
                })
                .catch(err => {
                    console.error("Error fetching bookings:", err);
                    setExistingBookings([]);
                })
                .finally(() => setLoadingBookings(false));
        }
    }, [step, formData.date]);

    // Helper Price


    // --- STEP 4: AUTO-ASSIGN THERAPISTS ---
    useEffect(() => {
        if (step === 4) {
            const assignTherapists = async () => {
                setCalculatingAssignment(true);
                setAssignedMasseuses({}); // Reset pre-calcolo

                try {
                    const dateStr = getLocalISOString(formData.date);
                    const myStartTime = formData.time;

                    // 1. Fetch Parallelo: Massaggiatrici e Prenotazioni Esistenti
                    const [masseuseRes, bookingsRes] = await Promise.all([
                        fetch('/api/masseuses'),
                        fetch(`/api/bookings?date=${dateStr}`)
                    ]);

                    if (!masseuseRes.ok || !bookingsRes.ok) throw new Error("Data fetch failed");

                    const masseuseJson = await masseuseRes.json();
                    const bookingsJson = await bookingsRes.json();

                    const allMasseuses: any[] = masseuseJson.data || [];
                    const todaysBookings: any[] = bookingsJson.data || [];

                    // Helpers
                    const toMin = (t: string) => {
                        const [h, m] = t.split(':').map(Number);
                        return h * 60 + m;
                    };

                    const newAssignments: Record<number, any> = {};
                    const currentlyAssignedIds: string[] = []; // Per evitare doppi assegnamenti nello stesso batch

                    // 2. Ciclo su ogni selezione dell'utente per trovare un terapista
                    selections.forEach((sel, idx) => {
                        const myStart = toMin(myStartTime);
                        const myDuration = sel.pkg.minutes;
                        const myEnd = myStart + myDuration;

                        // Filtra chi è libero
                        const available = allMasseuses.filter(m => {
                            // Check DB Bookings
                            const isBusyInDB = todaysBookings.some((b: any) => {
                                const bAttr = b.attributes || b;
                                const bMasseuseId = bAttr?.masseuse?.id ;
                                if (String(bMasseuseId) !== String(m.id)) return false;

                                const bStart = toMin((bAttr.time || "").substring(0, 5));
                                const bDuration = Number(bAttr.duration || 60);
                                const bEnd = bStart + bDuration;

                                return Math.max(myStart, bStart) < Math.min(myEnd, bEnd); // Overlap Logic
                            });

                            // Check Current Batch (se ho 2 ospiti, non assegno la stessa persona)
                            const isBusyInBatch = currentlyAssignedIds.includes(String(m.id));

                            return !isBusyInDB && !isBusyInBatch;
                        });

                        // Assegna Random
                        if (available.length > 0) {
                            const randomIndex = Math.floor(Math.random() * available.length);
                            const chosenOne = available[randomIndex];

                            newAssignments[idx] = chosenOne;
                            currentlyAssignedIds.push(String(chosenOne.id));
                        }
                    });

                    setAssignedMasseuses(newAssignments);

                } catch (error) {
                    console.error("Error assigning therapists:", error);
                } finally {
                    setCalculatingAssignment(false);
                }
            };

            assignTherapists();
        }
    }, [step, selections, formData.date, formData.time]); // Riesegue se cambiano date o selezioni

    // Navigation Handlers
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

                    <div className="flex flex-row justify-between gap-6 pt-4 mb-2">
                        <div className="w-1/2 flex flex-col">
                            <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                                <User size={12} /> Guests
                            </p>
                            <div className="flex items-center gap-3 bg-black/20 rounded-lg border border-white/10 w-fit">
                                <button
                                    onClick={() => setPersons(Math.max(1, persons - 1))}
                                    disabled={persons <= 1}
                                    className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                                >-</button>
                                <span className="text-xl text-white w-6 text-center">{persons}</span>
                                <button
                                    onClick={() => setPersons(Math.min(MAX_CONTEMPORANY_TREATMENTS, persons + 1))}
                                    disabled={persons >= MAX_CONTEMPORANY_TREATMENTS}
                                    className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                                >+</button>
                            </div>
                        </div>

                        <div className="w-1/2 flex flex-col items-end">
                            <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-3 flex items-center gap-2 self-end">
                                <Globe size={12} /> Language
                            </p>
                            <div className="bg-black/20 p-1 rounded-full flex border border-white/10 relative">
                                <button
                                    onClick={() => setFormData({ ...formData, isKhmer: false })}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${!formData.isKhmer ? 'bg-lotus-gold text-lotus-blue shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >EN</button>
                                <button
                                    onClick={() => setFormData({ ...formData, isKhmer: true })}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 font-khmer ${formData.isKhmer ? 'bg-lotus-gold text-lotus-blue shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >KH</button>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!formData.email || !formData.phone}
                        onClick={nextStep}
                        className="w-full mt-6 bg-lotus-gold text-lotus-blue font-bold py-3 rounded hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >Continue</button>
                </div>
            </div>
        </div>
    );

    // STEP 2: SELECTION
    const renderStep2 = () => {
        const isQuotaMet = selections.length >= persons;
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-5xl relative">
                {showSelectionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-lotus-blue border border-lotus-gold px-6 py-4 rounded-xl w-full max-w-md shadow-2xl relative">
                            <button onClick={() => setShowSelectionModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
                            <h3 className="text-xl font-agr text-white mb-4 mt-8">Your Selections</h3>
                            {selections.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No treatments selected yet.</p>
                            ) : (
                                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                    {selections.map((sel, idx) => (
                                        <div key={idx} className="bg-white/5 p-3 rounded border border-white/10 flex justify-between items-center">
                                            <div>
                                                <div className="text-xs text-lotus-gold font-bold uppercase mb-1">Guest {idx + 1}</div>
                                                <div className="font-semibold text-white">{sel.treatment.title}</div>
                                                <div className="text-sm text-gray-400">{sel.pkg.minutes} min - {formatPrice(sel.pkg.discountedPrice || sel.pkg.price)}</div>
                                            </div>
                                            <button onClick={() => removeSelection(idx)} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-gray-400">Total:</span>
                                <span className="text-xl font-bold text-lotus-gold">{formatPrice(currentTotal)}</span>
                            </div>
                            <button onClick={() => setShowSelectionModal(false)} className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 rounded transition-colors">Close</button>
                        </div>
                    </div>
                )}

                <div className="mb-6 flex justify-between items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-agr text-white mb-2">Select Treatments</h2>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCat(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${activeCat === cat ? 'bg-lotus-gold text-lotus-blue shadow-lg' : 'border border-lotus-gold/30 text-lotus-bronze hover:border-lotus-gold hover:text-white'}`}
                                >{cat}</button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSelectionModal(true)}
                        // Aggiungiamo 'duration-500' per rendere fluido l'effetto pulse
                        className={`group flex items-center gap-3 px-5 py-3 rounded-lg border transition-all duration-500 
                        ${triggerGlow
                                // STATO 1: GLOW PULSE (Priorità massima, dura 0.5s)
                                // Ombra dorata forte, bordo dorato, leggero ingrandimento e sfondo dorato trasparente
                                ? 'bg-lotus-gold/20 border-lotus-gold text-white shadow-[0_0_25px_rgba(251,191,36,0.8)] scale-105 z-10'
                                : isQuotaMet
                                    // STATO 2: QUOTA RAGGIUNTA (Stato fisso)
                                    ? 'bg-lotus-gold border-lotus-gold text-lotus-blue shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                                    // STATO 3: DEFAULT (Stato normale)
                                    : 'bg-white/5 border-white/20 text-white hover:border-lotus-gold/50'
                            }
                    `}
                    >
                        <div className="text-right">
                            {/* ... contenuto del bottone ... */}
                            <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Selected</div>
                            <div className="text-xl font-bold leading-none">{selections.length} / {persons}</div>
                        </div>
                        <div className="h-8 w-px bg-current opacity-20"></div>
                        <User size={20} />
                    </button>
                </div>

                <div className="pr-2 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {initialTreatments[activeCat]?.map((t) => {
                            const isExpanded = formData.treatment?.id === t.id;
                            return (
                                <div key={t.id} className={`rounded-lg border transition-all relative overflow-hidden ${isExpanded ? 'border-lotus-gold bg-white/5' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                                    <div onClick={() => setFormData(prev => ({ ...prev, treatment: isExpanded ? null : t }))} className="p-6 cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold text-white">{t.title}</h3>
                                            <ChevronRight className={`text-lotus-gold transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-2">{t.description}</p>
                                    </div>
                                    {isExpanded && (
                                        <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                                            <div className="h-px w-full bg-white/10 mb-4"></div>
                                            <p className="text-xs text-lotus-bronze uppercase font-bold tracking-widest mb-3">Available Packages</p>
                                            <div className="space-y-3">
                                                {t.packages?.sort((a, b) => a.minutes - b.minutes).map(pkg => (
                                                    <div key={pkg.id} className="flex items-center justify-between p-3 rounded bg-black/20 hover:bg-black/40 border border-transparent hover:border-white/10 transition-all">
                                                        <div className="flex items-center gap-3 text-white">
                                                            <Clock size={16} className="text-lotus-gold" />
                                                            <span className="font-medium text-sm">{pkg.minutes} Min</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-bold text-lotus-gold">{formatPrice(pkg.discountedPrice || pkg.price)}</span>
                                                            <button
                                                                disabled={isQuotaMet}
                                                                onClick={(e) => { e.stopPropagation(); addSelection(t, pkg); }}
                                                                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${isQuotaMet ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' : 'bg-lotus-gold text-lotus-blue hover:bg-white hover:scale-105 shadow-lg'}`}
                                                            >
                                                                {isQuotaMet ? 'Full' : 'Add +'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-full pt-6 mt-4 border-t border-white/10 flex justify-between items-center py-4">
                    <button onClick={prevStep} className="text-white hover:text-lotus-gold underline underline-offset-4 transition-colors">Back</button>
                    <div className="flex items-center gap-4">
                        {!isQuotaMet && selections.length > 0 && <span className="text-sm text-lotus-gold animate-pulse">Select {persons - selections.length} more...</span>}
                        <button
                            disabled={!isQuotaMet}
                            onClick={nextStep}
                            className="bg-lotus-gold text-lotus-blue font-bold py-3 px-8 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
                        >Confirm Selections ({selections.length})</button>
                    </div>
                </div>
            </div>
        );
    };

    // STEP 3: DATE & TIME
    const renderStep3 = () => {
        const today = new Date();
        const now = new Date();
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

        // Helper Time
        const timeToMinutes = (str: string) => {
            const [h, m] = str.split(':').map(Number);
            return h * 60 + m;
        };

        // --- CHECK DISPONIBILITÀ (Backwards) ---
        // Controlla se 'minutePoint' è occupato da un booking iniziato prima
        const getActiveBookingsAt = (targetDateStr: string, minutePoint: number, debugMode = false) => {
            return existingBookings.filter(b => {
                const bDate = getLocalISOString(b.date);
                if (bDate !== targetDateStr) return false;

                const start = timeToMinutes((b.time || "").substring(0, 5));
                // Qui ora siamo sicuri che duration sia un numero (grazie al mapping nel useEffect)
                const duration = b.duration || 60;
                const end = start + duration;

                const isOverlapping = start <= minutePoint && minutePoint < end;

                if (debugMode && isOverlapping) {
                    // console.log(`   -> Conflitto con Booking ID: ${b.documentId} (Start: ${start}, End: ${end})`);
                }

                return isOverlapping;
            }).length;
        };

        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-5xl flex flex-col md:flex-row gap-8">
                {/* Calendar */}
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
                                const isSelected = getLocalISOString(formData.date) === getLocalISOString(dateObj);
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
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Slots */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-agr text-white mb-6">Select Time</h3>
                    {!formData.date ? (
                        <div className="h-full max-h-80 flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg text-gray-500 bg-white/5">Please select a date first</div>
                    ) : loadingBookings ? (
                        <div className="h-full max-h-80 flex items-center justify-center text-lotus-gold animate-pulse bg-white/5 rounded-lg">Checking availability...</div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map(time => {
                                const selectedDateStr = getLocalISOString(formData.date);
                                const myStart = timeToMinutes(time);

                                // [FIX] Usiamo la durata salvata in formData nello step precedente
                                const treatmentDuration = formData.duration || 60;
                                const myEnd = myStart + treatmentDuration;

                                // --- LOGICA CORE DI DISPONIBILITÀ ---
                                let isBlocked = false;

                                // CHECK "IN AVANTI": Il mio trattamento sbatte contro qualcuno nel futuro?
                                // Loop ogni 30 min da MyStart a MyEnd
                                for (let checkTime = myStart; checkTime < myEnd; checkTime += 30) {
                                    const activeCount = getActiveBookingsAt(selectedDateStr, checkTime);
                                    const slotsRemaining = MAX_CONTEMPORANY_TREATMENTS - activeCount;

                                    if (slotsRemaining < persons) {
                                        isBlocked = true; // Trovato un muro
                                        break;
                                    }
                                }

                                // Calcoli per UI Labels (Left, Full) basati sull'orario di Start
                                const startActiveCount = getActiveBookingsAt(selectedDateStr, myStart);
                                const startSlotsRemaining = MAX_CONTEMPORANY_TREATMENTS - startActiveCount;

                                // Logica Too Close
                                let isTooClose = false;
                                const cutoffTime = new Date(now.getTime() + MIN_NOTICE_MINUTES * 60000);
                                const isToday = getLocalISOString(formData.date) === getLocalISOString(today);
                                if (isToday && formData.date) {
                                    const slotTime = new Date(formData.date);
                                    const [hours] = time.split(':').map(Number);
                                    slotTime.setHours(hours, 0, 0, 0);
                                    if (slotTime < cutoffTime) isTooClose = true;
                                }

                                const isDisabled = isBlocked || isTooClose;
                                const isSelected = formData.time === time;

                                return (
                                    <button
                                        key={time}
                                        disabled={isDisabled}
                                        onClick={() => setFormData({ ...formData, time })}
                                        className={`py-4 rounded border text-sm transition-all relative font-medium
                                            ${isSelected ? 'bg-lotus-gold border-lotus-gold text-lotus-blue shadow-md' : 'border-lotus-gold/30 text-white hover:border-lotus-gold hover:bg-white/5'}
                                            ${isDisabled ? 'cursor-not-allowed bg-black/20 border-transparent opacity-50' : ''}
                                        `}
                                    >
                                        {time}

                                        {/* Caso: Libero all'inizio, ma non c'è abbastanza tempo (Overlap futuro) */}
                                        {isDisabled && !isTooClose && startSlotsRemaining >= persons && (
                                            <span className="absolute translate-x-1/2 text-[10px] bg-red-500/80 text-white px-1 rounded whitespace-nowrap">
                                                No Time
                                            </span>
                                        )}

                                        {/* Caso: Slot con posti limitati */}
                                        {!isDisabled && startSlotsRemaining < 3 && (
                                            <span className={`absolute translate-x-1/2 text-[10px] text-white px-1.5 rounded whitespace-nowrap ${startSlotsRemaining > 0 ? 'bg-amber-500/80' : 'bg-red-500/80'}`}>
                                                {`${startSlotsRemaining} Left`}
                                            </span>
                                        )}

                                        {isDisabled && startSlotsRemaining < persons && !isTooClose && (
                                            <span className="absolute translate-x-1/2 text-[10px] bg-red-500/80 text-white px-1 rounded whitespace-nowrap">Full</span>
                                        )}

                                        {isTooClose && <span className="absolute translate-x-1/2 text-[10px] bg-gray-600 text-white px-1 rounded whitespace-nowrap">Too late</span>}
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
                    >Review Booking</button>
                </div>
            </div>
        );
    };

    // STEP 4: RECAP & SUBMIT
    // STEP 4: RECAP & SUBMIT
    // STEP 4: RECAP & SUBMIT
const renderStep4 = () => {
    const grandTotal = selections.reduce((acc, item) => acc + (item.pkg.discountedPrice || item.pkg.price), 0);

    // --- NUOVO LAYOUT DI CONFERMA (POST-BOOKING) ---
    if (isConfirmed) {
        return (
            <div className="animate-in fade-in zoom-in duration-500 w-full max-w-2xl bg-white/5 border border-lotus-gold/40 p-10 rounded-lg shadow-2xl backdrop-blur-md text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-lotus-gold rounded-full p-4 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        <Check size={48} className="text-lotus-blue" />
                    </div>
                </div>
                
                <h2 className="text-4xl font-agr text-white mb-4">Booking Confirmed!</h2>
            

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-white/5 p-6 rounded-lg border border-white/10 mb-2 mt-16">
                    <div className="space-y-1">
                        <p className="text-lotus-bronze text-[10px] uppercase font-bold tracking-[0.2em]">Reservation Details</p>
                        <p className="text-white text-sm">Date: {formData.date?.toLocaleDateString()}</p>
                        <p className="text-white text-sm">Time: {formData.time}</p>
                        <p className="text-white text-sm">Guests: {persons}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-lotus-bronze text-[10px] uppercase font-bold tracking-[0.2em]">Notification</p>
                        <p className="text-green-400 text-sm flex items-center gap-1 font-medium">
                            <Mail size={14} /> Confirmation Email Sent
                        </p>
                        <p className="text-gray-400 text-[11px] leading-tight mt-1">Sent to: {formData.email}</p>
                    </div>
                    <div className="md:col-span-2 mt-2">
                        <p className="text-lotus-bronze text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Treatments</p>
                        <ul className="space-y-1">
                            {selections.map((sel, i) => (
                                <li key={i} className="text-xs text-gray-300 flex justify-between">
                                    <span>• {sel.treatment.title} ({sel.pkg.minutes} min)</span>
                                    {assignedMasseuses[i] && (
                                        <span className="text-lotus-gold">with {assignedMasseuses[i].attributes?.name || assignedMasseuses[i].name}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-8 px-4">
                    Please arrive 10 minutes before your scheduled time. We look forward to seeing you.
                </p>

                <button 
                    onClick={() => window.location.href = '/'} 
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 px-10 rounded transition-all flex items-center gap-2 mx-auto"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    // --- LAYOUT DI REVISIONE (IL TUO ORIGINALE) ---
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-2xl bg-white/5 border border-lotus-gold/20 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-agr text-white mb-8 text-center">Confirm Reservation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white mb-8">
                <div className="space-y-1">
                    <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-2">Guest Details</p>
                    <div className="text-xl font-medium flex items-center gap-2">
                        {formData.name || 'Guest'}
                        {persons > 1 && <span className="text-sm text-lotus-gold bg-lotus-gold/10 px-2 py-0.5 rounded-full border border-lotus-gold/20">Party of {persons}</span>}
                    </div>
                    <div className="text-gray-400 text-sm flex items-center gap-2"><Mail size={14} /> {formData.email}</div>
                    <div className="text-gray-400 text-sm flex items-center gap-2"><Phone size={14} /> {formData.phone}</div>
                    <div className="text-gray-400 text-sm flex items-center gap-2 mt-1"><Globe size={14} /> Language: {formData.isKhmer ? 'Khmer' : 'English'}</div>
                </div>
                <div className="space-y-1">
                    <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-2">Date & Time</p>
                    <div className="flex items-center gap-2 text-lg font-medium"><CalendarIcon size={18} className="text-lotus-gold" /> {formData.date?.toLocaleDateString()}</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-white"><Clock size={20} className="text-lotus-gold" /> {formData.time}</div>
                </div>

                <div className="md:col-span-2 border-t border-white/10 pt-6 mt-2">
                    <p className="text-lotus-bronze text-xs uppercase font-bold tracking-widest mb-3">Selected Treatments ({selections.length})</p>
                    {calculatingAssignment && <div className="text-xs text-lotus-gold animate-pulse mb-2">Assigning therapists...</div>}

                    <div className="bg-white/5 rounded border border-white/10 divide-y divide-white/5">
                        {selections.map((sel, idx) => {
                            const assigned = assignedMasseuses[idx];
                            const masseuseName = assigned ? (assigned.attributes?.name || assigned.name) : null;

                            return (
                                <div key={idx} className="p-4 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Guest {idx + 1}</div>
                                        <div className="font-semibold text-lotus-gold">{sel.treatment.title}</div>
                                        <div className="text-sm text-gray-400 flex items-center gap-1">
                                            {sel.pkg.minutes} Minutes Session
                                            {masseuseName && (
                                                <>
                                                    <span>with</span>
                                                    <span className="text-white font-bold bg-white/10 px-1.5 rounded ml-1">{masseuseName}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xl text-white">{formatPrice(sel.pkg.discountedPrice || sel.pkg.price)}</div>
                                </div>
                            );
                        })}
                        <div className="p-4 bg-lotus-gold/10 flex justify-between items-center">
                            <div className="font-bold text-white uppercase tracking-wider">Total Amount</div>
                            <div className="text-3xl text-lotus-gold">{formatPrice(grandTotal)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <button onClick={prevStep} className="text-white hover:text-lotus-gold underline underline-offset-4 transition-colors">Modify Details</button>
                <button
                    disabled={isSubmitting || calculatingAssignment}
                    onClick={async () => {
                        setIsSubmitting(true);
                        try {
                            const dateStr = getLocalISOString(formData.date);
                            const bookingPromises = selections.map((sel, idx) => {
                                const assignedId = assignedMasseuses[idx]?.documentId || null;
                                const payload = {
                                    name: formData.name,
                                    email: formData.email,
                                    phone: formData.phone,
                                    isKhmer: formData.isKhmer,
                                    date: dateStr,
                                    time: formData.time,
                                    persons_count: persons,
                                    treatment: sel.treatment,
                                    selectedPackage: sel.pkg,
                                    duration: sel.pkg.minutes,
                                    price: sel.pkg.discountedPrice || sel.pkg.price,
                                    masseuseDocId: assignedId
                                };

                                return fetch('/api/bookings', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                }).then(res => { if (!res.ok) throw new Error("A booking failed"); return res.json(); });
                            });

                            await Promise.all(bookingPromises);
                            // Setta qui il tuo stato per mostrare il layout di conferma
                            setIsConfirmed(true); 
                        } catch (error) {
                            console.error(error);
                            alert("Something went wrong processing your bookings. Please contact us.");
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                    className={`bg-lotus-gold hover:bg-white text-lotus-blue font-bold py-3 px-12 rounded shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 ${isSubmitting || calculatingAssignment ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {isSubmitting ? <>Processing...</> : <><Check size={20} /> Confirm Booking</>}
                </button>
            </div>
        </div>
    );
};

    return (
        <div className="w-full flex flex-col items-center">
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