import { useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import AirportCombobox from '../Components/AirportCombobox';
import PassengerPicker from '../Components/PassengerPicker';

const POPULAR_ROUTES = [
    { from: 'DAC', to: 'DXB', label: 'Dhaka → Dubai' },
    { from: 'DAC', to: 'DOH', label: 'Dhaka → Doha' },
    { from: 'DAC', to: 'KUL', label: 'Dhaka → Kuala Lumpur' },
    { from: 'DAC', to: 'LHR', label: 'Dhaka → London' },
    { from: 'DAC', to: 'BKK', label: 'Dhaka → Bangkok' },
];

const TODAY = new Date().toISOString().split('T')[0];

export default function Home({ airports }) {
    const [origin, setOrigin]           = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate]               = useState(TODAY);
    const [passengers, setPassengers]   = useState({ adults: 1, children: 0, infants: 0 });
    const [errors, setErrors]           = useState({});
    const [searching, setSearching]     = useState(false);

    function swap() {
        setOrigin(destination);
        setDestination(origin);
    }

    function validate() {
        const e = {};
        if (!origin)      e.origin      = 'Please select an origin';
        if (!destination) e.destination = 'Please select a destination';
        if (origin && destination && origin === destination) e.destination = 'Origin and destination must differ';
        if (!date)        e.date        = 'Please pick a travel date';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function submit(e) {
        e.preventDefault();
        if (!validate()) return;
        setSearching(true);
        router.get('/search', {
            origin,
            destination,
            date,
            passengers: passengers.adults + passengers.children + passengers.infants,
        }, { onFinish: () => setSearching(false) });
    }

    function quickRoute(from, to) {
        setOrigin(from);
        setDestination(to);
    }

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-32 bg-navy">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-500 blur-[100px]" />
                </div>
                
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8 transform transition-all hover:bg-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Embassy Compliant Service</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                        Instant Flight Itinerary<br />
                        <span className="text-brand">for Visa Applications</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-0">
                        Generate professional, verifiable flight reservations for your visa application in minutes. Simple, fast, and globally accepted.
                    </p>
                </div>
            </div>

            {/* Search Box Section */}
            <div className="max-w-4xl mx-auto -mt-20 relative z-20 px-6">
                <form onSubmit={submit} className="glass rounded-3xl overflow-hidden shadow-2xl p-1.5 border-white/40">
                    <div className="bg-white rounded-[1.4rem] p-6 md:p-8">
                        {/* Route selection */}
                        <div className="flex flex-col md:flex-row items-stretch gap-4 relative">
                            <div className="flex-1 md:mr-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Departure From</label>
                                <AirportCombobox
                                    airports={airports}
                                    value={origin}
                                    onChange={setOrigin}
                                    placeholder="Select Origin"
                                    exclude={destination}
                                />
                                {errors.origin && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{errors.origin}</p>}
                            </div>

                            {/* Swap button */}
                            <div className="flex items-center justify-center -my-2 md:my-0 md:absolute md:left-1/2 md:top-[26px] md:-translate-x-1/2 z-20">
                                <button
                                    type="button"
                                    onClick={swap}
                                    className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 text-slate-400 hover:text-brand hover:border-brand shadow-lg hover:shadow-brand/20 transition-all transform hover:rotate-180 active:scale-90 flex items-center justify-center"
                                    title="Swap locations"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 16-4-4 4-4"/><path d="M3 12h18"/><path d="m17 8 4 4-4 4"/></svg>
                                </button>
                            </div>

                            <div className="flex-1 md:ml-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Arrival At</label>
                                <AirportCombobox
                                    airports={airports}
                                    value={destination}
                                    onChange={setDestination}
                                    placeholder="Select Destination"
                                    exclude={origin}
                                />
                                {errors.destination && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{errors.destination}</p>}
                            </div>
                        </div>

                        {/* Date and Passengers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="md:mr-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Departure Date</label>
                                <div className="group relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-brand transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                                    </div>
                                    <input
                                        type="date"
                                        min={TODAY}
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all hover:bg-slate-100"
                                    />
                                </div>
                                {errors.date && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{errors.date}</p>}
                            </div>

                            <div className="md:ml-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Travelers</label>
                                <PassengerPicker value={passengers} onChange={setPassengers} />
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="mt-10">
                            <button
                                type="submit"
                                disabled={searching}
                                className="w-full group bg-navy hover:bg-navy-light text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-navy/10 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-lg overflow-hidden relative"
                            >
                                {searching ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <span className="tracking-tight">Searching Flights...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="tracking-tight">Search Available Flights</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Popular routes */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mr-2">Fast Search:</span>
                            {POPULAR_ROUTES.map(r => (
                                <button
                                    key={r.label}
                                    type="button"
                                    onClick={() => quickRoute(r.from, r.to)}
                                    className="text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-brand hover:text-white border border-slate-200 hover:border-brand rounded-xl px-4 py-1.5 transition-all"
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </div>

            {/* Values/Features Section */}
            <div className="max-w-5xl mx-auto px-6 mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>, 
                            title: 'Instant Issuance', 
                            desc: 'Get your professional PDF itinerary immediately after manual verification of your payment.',
                            color: 'bg-blue-50 text-blue-600'
                        },
                        { 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>, 
                            title: 'Embassy Approved', 
                            desc: 'Our itineraries follow standard IATA formats, making them perfect for Schengen, UK, USA, and other visa types.',
                            color: 'bg-emerald-50 text-emerald-600'
                        },
                        { 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>, 
                            title: 'Secure Payments', 
                            desc: 'Pay safely using bKash. Every transaction is manually audited to ensure security and peace of mind.',
                            color: 'bg-rose-50 text-rose-600'
                        },
                    ].map((f, i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">{f.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Process Section */}
            <div className="max-w-4xl mx-auto px-6 mt-32 mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">How it Works</h2>
                    <p className="text-slate-500">Your professional itinerary in four simple steps</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                    {[
                        { step: '01', title: 'Find Flight', desc: 'Search and select your preferred route' },
                        { step: '02', title: 'Passport Info', desc: 'Provide passenger details for the itinerary' },
                        { step: '03', title: 'Payment', desc: 'Transfer fee via bKash and submit reference' },
                        { step: '04', title: 'Receive PDF', desc: 'Download your document once verified' },
                    ].map((s, i) => (
                        <div key={i} className="relative group">
                            <div className="text-[60px] font-black text-slate-100 absolute -top-8 -left-2 z-0 group-hover:text-brand/10 transition-colors">{s.step}</div>
                            <div className="relative z-10 pt-4">
                                <h4 className="font-black text-slate-900 mb-2">{s.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>

    );
}
