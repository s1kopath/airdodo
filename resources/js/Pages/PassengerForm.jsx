import { useEffect, useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Layout from '../Components/Layout';
import StepBar from '../Components/StepBar';
import Tesseract from 'tesseract.js';

const TITLES    = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'];
const COUNTRIES = [
    ['BD', 'Bangladesh 🇧🇩'], ['AE', 'UAE 🇦🇪'], ['QA', 'Qatar 🇶🇦'],
    ['KW', 'Kuwait 🇰🇼'], ['OM', 'Oman 🇴🇲'], ['SA', 'Saudi Arabia 🇸🇦'],
    ['MY', 'Malaysia 🇲🇾'], ['SG', 'Singapore 🇸🇬'], ['TH', 'Thailand 🇹🇭'],
    ['GB', 'United Kingdom 🇬🇧'], ['CA', 'Canada 🇨🇦'], ['US', 'United States 🇺🇸'],
];

function blankPassenger() {
    return { type: 'adult', title: 'Mr', first_name: '', last_name: '', date_of_birth: '', nationality: 'BD', passport_number: '', passport_expiry: '' };
}

function InputField({ label, error, children, hint }) {
    return (
        <div className="group space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</label>
            {children}
            {hint && !error && <p className="text-slate-400 text-[10px] font-medium mt-1 ml-1">{hint}</p>}
            {error && <p className="text-rose-500 text-[10px] font-black mt-1.5 ml-1 flex items-center gap-1 uppercase tracking-tight">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                {error}
            </p>}
        </div>
    );
}

const inputCls = (hasError) =>
    `w-full bg-slate-50 border-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all outline-none
    ${hasError
        ? 'border-rose-100 bg-rose-50 text-rose-900 focus:border-rose-300'
        : 'border-transparent text-slate-900 focus:border-brand focus:bg-white hover:bg-slate-100'}`;

export default function PassengerForm({ flight, date, passengers }) {
    const initial = Array.from({ length: passengers }, blankPassenger);

    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        flight_id:     flight.id,
        travel_date:   date,
        contact_name:  auth.user?.name ?? '',
        contact_email: auth.user?.email ?? '',
        contact_phone: '',
        passengers:    initial,
    });

    const [scanning, setScanning] = useState(null); // idx of passenger being scanned
    const fileInputRef = useRef(null);

    async function handleScan(idx, file) {
        if (!file) return;

        console.log(`[OCR] Starting scan for passenger ${idx + 1}...`, file.name);
        setScanning(idx);
        
        try {
            // Step 1: Client-side OCR
            console.log('[OCR] Running Tesseract.js locally...');
            const { data: { text } } = await Tesseract.recognize(file, 'eng');
            console.log('[OCR] Text detected:', text);

            if (!text || text.trim().length === 0) {
                console.warn('[OCR] No text detected in image.');
                alert('No text detected in image. Please ensure the photo is clear.');
                return;
            }

            // Step 2: Send extracted text to backend for parsing
            console.log('[OCR] Sending text to backend for parsing...');
            const response = await fetch('/ocr/scan', {
                method: 'POST',
                body: JSON.stringify({ text }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                }
            });

            const result = await response.json();
            console.log('[OCR] Backend result:', result);

            if (result.success) {
                const pax = [...data.passengers];
                pax[idx] = {
                    ...pax[idx],
                    first_name:      result.first_name || pax[idx].first_name,
                    last_name:       result.last_name || pax[idx].last_name,
                    date_of_birth:   result.date_of_birth || pax[idx].date_of_birth,
                    passport_number: result.passport_number || pax[idx].passport_number,
                    nationality:     result.nationality || pax[idx].nationality,
                };
                setData('passengers', pax);
                console.log('[OCR] Passenger form updated successfully.');
            } else {
                console.error('[OCR] Backend failed to parse:', result.message);
                alert(result.message || 'Failed to parse passport data. Please enter manually.');
            }
        } catch (error) {
            console.error('[OCR] Critical Error:', error);
            alert('An error occurred during scanning.');
        } finally {
            setScanning(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            document.querySelector('[data-error-anchor]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errors]);

    const fmt = t => t?.substring(0, 5) ?? '';

    function setPax(idx, field, value) {
        const pax = [...data.passengers];
        pax[idx] = { ...pax[idx], [field]: value };
        setData('passengers', pax);
    }

    function submit(e) {
        e.preventDefault();
        post('/book');
    }

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Layout>
            <StepBar current={2} />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Flight summary strip */}
                <div className="bg-navy rounded-3xl p-8 mb-12 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
                    <div className="absolute right-[-5%] top-[-10%] opacity-10 transform rotate-[15deg]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[80px]">
                                <div className="text-[10px] text-brand font-black uppercase tracking-widest mb-1">Flight</div>
                                <div className="font-black text-xl tracking-tight">{flight.flight_number}</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-3xl font-black tracking-tight leading-none mb-2">
                                    <span>{flight.origin?.iata_code}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="m9 18 6-6-6-6"/></svg>
                                    <span>{flight.destination?.iata_code}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.1em]">{flight.airline?.name}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.1em]">{flight.cabin_class ?? 'Economy'} Class</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10 w-full md:w-auto justify-between md:justify-start">
                            <div className="text-left md:text-right">
                                <div className="text-brand text-[10px] font-black uppercase tracking-widest mb-1">Travel Date</div>
                                <div className="font-black text-lg">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-brand text-[10px] font-black uppercase tracking-widest mb-1">Departure</div>
                                <div className="font-black text-lg">{fmt(flight.departure_time)} <span className="text-slate-500 font-bold ml-1 text-sm">Local</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {hasErrors && (
                    <div data-error-anchor className="mb-10 flex items-center gap-4 bg-rose-50 border border-rose-100 rounded-[2rem] px-8 py-5 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                        </div>
                        <div>
                            <div className="text-rose-900 font-black text-lg leading-none mb-1">Incomplete Information</div>
                            <div className="text-rose-600/70 text-xs font-bold uppercase tracking-wide">Please check the highlighted fields in the form below</div>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-10">
                    {/* Contact section */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                            <div className="w-12 h-12 rounded-[1.2rem] bg-brand/10 text-brand flex items-center justify-center shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight">Contact Information</h3>
                                <p className="text-slate-400 text-xs font-medium">Your itinerary and receipt will be sent to these details</p>
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InputField label="Contact Name" error={errors.contact_name} hint="Full name of primary contact">
                                <input className={inputCls(!!errors.contact_name)}
                                    value={data.contact_name}
                                    onChange={e => setData('contact_name', e.target.value)}
                                    placeholder="Enter your name" />
                            </InputField>
                            <InputField label="Email Address" error={errors.contact_email} hint="For PDF delivery">
                                <input type="email" className={inputCls(!!errors.contact_email)}
                                    value={data.contact_email}
                                    onChange={e => setData('contact_email', e.target.value)}
                                    placeholder="your@email.com" />
                            </InputField>
                            <InputField label="Phone Number" error={errors.contact_phone} hint="Mobile or WhatsApp">
                                <input className={inputCls(!!errors.contact_phone)}
                                    value={data.contact_phone}
                                    onChange={e => setData('contact_phone', e.target.value)}
                                    placeholder="+880 1XXX-XXXXXX" />
                            </InputField>
                        </div>
                    </div>

                    {/* Passenger sections */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-2 h-8 bg-brand rounded-full" />
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Passenger Details</h3>
                        </div>
                        
                        {data.passengers.map((pax, idx) => {
                            const paxErrors = Object.keys(errors).some(k => k.startsWith(`passengers.${idx}.`));
                            return (
                                <div key={idx} className={`bg-white rounded-[2.5rem] shadow-sm border transition-all duration-500 overflow-hidden ${paxErrors ? 'border-rose-200 ring-4 ring-rose-50' : 'border-slate-100 hover:shadow-xl'}`}>
                                    <div className={`flex items-center justify-between px-8 py-6 border-b ${paxErrors ? 'bg-rose-50 border-rose-100' : 'bg-slate-50/50 border-slate-50'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-lg shadow-inner ${paxErrors ? 'bg-rose-500 text-white' : 'bg-navy text-white'}`}>
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg tracking-tight">Passenger {idx + 1}</h3>
                                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Passport details required</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={e => handleScan(idx, e.target.files[0])}
                                            />
                                            <button
                                                type="button"
                                                disabled={scanning !== null}
                                                onClick={() => {
                                                    setScanning(idx);
                                                    fileInputRef.current.click();
                                                }}
                                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                                                    scanning === idx 
                                                        ? 'bg-slate-100 text-slate-400' 
                                                        : 'bg-brand/10 text-brand hover:bg-brand hover:text-white shadow-sm'
                                                }`}
                                            >
                                                {scanning === idx ? (
                                                    <>
                                                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                        </svg>
                                                        Scanning...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                                                        Scan Passport
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-8 space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                            <InputField label="Passenger Type" error={errors[`passengers.${idx}.type`]}>
                                                <select className={inputCls(!!errors[`passengers.${idx}.type`])}
                                                    value={pax.type} onChange={e => setPax(idx, 'type', e.target.value)}>
                                                    <option value="adult">Adult (12+)</option>
                                                    <option value="child">Child (2–11)</option>
                                                    <option value="infant">Infant (&lt;2)</option>
                                                </select>
                                            </InputField>
                                            <InputField label="Title" error={errors[`passengers.${idx}.title`]}>
                                                <select className={inputCls(!!errors[`passengers.${idx}.title`])}
                                                    value={pax.title} onChange={e => setPax(idx, 'title', e.target.value)}>
                                                    {TITLES.map(t => <option key={t} value={t}>{t}.</option>)}
                                                </select>
                                            </InputField>
                                            <InputField label="First Name" error={errors[`passengers.${idx}.first_name`]}>
                                                <input className={inputCls(!!errors[`passengers.${idx}.first_name`])}
                                                    value={pax.first_name}
                                                    onChange={e => setPax(idx, 'first_name', e.target.value)}
                                                    placeholder="First Name" />
                                            </InputField>
                                            <InputField label="Last Name" error={errors[`passengers.${idx}.last_name`]}>
                                                <input className={inputCls(!!errors[`passengers.${idx}.last_name`])}
                                                    value={pax.last_name}
                                                    onChange={e => setPax(idx, 'last_name', e.target.value)}
                                                    placeholder="Last Name" />
                                            </InputField>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                            <InputField label="Date of Birth" error={errors[`passengers.${idx}.date_of_birth`]}>
                                                <input type="date" className={inputCls(!!errors[`passengers.${idx}.date_of_birth`])}
                                                    value={pax.date_of_birth}
                                                    onChange={e => setPax(idx, 'date_of_birth', e.target.value)} />
                                            </InputField>
                                            <InputField label="Nationality" error={errors[`passengers.${idx}.nationality`]}>
                                                <select className={inputCls(!!errors[`passengers.${idx}.nationality`])}
                                                    value={pax.nationality}
                                                    onChange={e => setPax(idx, 'nationality', e.target.value)}>
                                                    {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                                                </select>
                                            </InputField>
                                            <InputField label="Passport No." error={errors[`passengers.${idx}.passport_number`]} hint="Recommended">
                                                <input className={`${inputCls(!!errors[`passengers.${idx}.passport_number`])} font-mono tracking-[0.2em] uppercase`}
                                                    value={pax.passport_number}
                                                    onChange={e => setPax(idx, 'passport_number', e.target.value)}
                                                    placeholder="A01234567" />
                                            </InputField>
                                            <InputField label="Passport Expiry" error={errors[`passengers.${idx}.passport_expiry`]} hint="Recommended">
                                                <input type="date" className={inputCls(!!errors[`passengers.${idx}.passport_expiry`])}
                                                    value={pax.passport_expiry}
                                                    onChange={e => setPax(idx, 'passport_expiry', e.target.value)} />
                                            </InputField>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Submit Section */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full group bg-navy hover:bg-navy-light text-white font-black py-5 rounded-[2rem] transition-all shadow-2xl shadow-navy/20 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-4 text-xl relative overflow-hidden"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    <span className="tracking-tight">Processing Reservation...</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-tight">Confirm Details & Finalize Reservation</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                </>
                            )}
                        </button>
                        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-8">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                            Data encrypted and secure
                        </p>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
