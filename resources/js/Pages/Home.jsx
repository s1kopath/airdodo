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
    const [date, setDate]               = useState('');
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
            {/* Hero */}
            <div className="relative overflow-hidden pb-28" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)' }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)' }} />
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                    <span className="absolute text-white/5 text-9xl" style={{ top: '10%', left: '5%', transform: 'rotate(-20deg)' }}>✈</span>
                    <span className="absolute text-white/5 text-7xl" style={{ bottom: '20%', right: '8%', transform: 'rotate(15deg)' }}>✈</span>
                </div>
                <div className="relative max-w-3xl mx-auto px-4 pt-14 pb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/10">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Embassy-compliant · No real booking required
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                        Flight Itinerary<br />
                        <span className="text-indigo-300">for Visa Application</span>
                    </h1>
                    <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
                        Search flights, fill passenger details, pay via bKash — get a PDF itinerary in minutes.
                    </p>
                </div>
            </div>

            {/* Search card — overlaps hero */}
            <div className="max-w-3xl mx-auto -mt-24 relative z-10 px-4">
                <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-5 sm:p-6">
                        {/* Route row */}
                        <div className="flex items-start gap-2">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">From</label>
                                <AirportCombobox
                                    airports={airports}
                                    value={origin}
                                    onChange={setOrigin}
                                    placeholder="City or airport"
                                    exclude={destination}
                                />
                                {errors.origin && <p className="text-red-500 text-xs mt-1 ml-1">{errors.origin}</p>}
                            </div>

                            {/* Swap */}
                            <button
                                type="button"
                                onClick={swap}
                                className="mt-7 flex-shrink-0 w-9 h-9 rounded-full border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 flex items-center justify-center transition-all group"
                                title="Swap origin and destination"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </button>

                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">To</label>
                                <AirportCombobox
                                    airports={airports}
                                    value={destination}
                                    onChange={setDestination}
                                    placeholder="City or airport"
                                    exclude={origin}
                                />
                                {errors.destination && <p className="text-red-500 text-xs mt-1 ml-1">{errors.destination}</p>}
                            </div>
                        </div>

                        {/* Date + Passengers row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Travel Date</label>
                                <div className={`flex items-center border-2 rounded-xl px-3 py-2.5 transition-all bg-white ${date ? 'border-gray-200' : 'border-gray-200'} focus-within:border-indigo-500 focus-within:shadow-sm hover:border-gray-300`}>
                                    <span className="text-gray-400 text-lg mr-2">📅</span>
                                    <input
                                        type="date"
                                        min={TODAY}
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800 min-w-0"
                                    />
                                </div>
                                {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Passengers</label>
                                <PassengerPicker value={passengers} onChange={setPassengers} />
                            </div>
                        </div>
                    </div>

                    {/* Search button */}
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                        <button
                            type="submit"
                            disabled={searching}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 text-base shadow-lg shadow-indigo-200"
                        >
                            {searching ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Searching…
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Search Flights
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Popular routes */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-medium">Popular:</span>
                    {POPULAR_ROUTES.map(r => (
                        <button
                            key={r.label}
                            type="button"
                            onClick={() => quickRoute(r.from, r.to)}
                            className="text-xs bg-white hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 border border-gray-200 hover:border-indigo-300 rounded-full px-3 py-1 transition-colors"
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feature cards */}
            <div className="max-w-3xl mx-auto px-4 mt-10 grid grid-cols-3 gap-4">
                {[
                    { icon: '⚡', title: 'Instant PDF', desc: 'Download minutes after approval', color: 'bg-amber-50 text-amber-500' },
                    { icon: '✅', title: 'Embassy Compliant', desc: 'Accepted by embassies worldwide', color: 'bg-emerald-50 text-emerald-500' },
                    { icon: '📱', title: 'Pay via bKash', desc: 'Simple mobile payment, verified manually', color: 'bg-pink-50 text-pink-500' },
                ].map(f => (
                    <div key={f.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center text-2xl mx-auto mb-3`}>{f.icon}</div>
                        <div className="font-bold text-sm text-gray-800">{f.title}</div>
                        <div className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</div>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <div className="max-w-3xl mx-auto px-4 mt-12 mb-8">
                <h2 className="text-center text-lg font-bold text-gray-800 mb-8">How it works</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { step: '1', icon: '🔍', title: 'Search', desc: 'Find your flight by route and date' },
                        { step: '2', icon: '📝', title: 'Fill Details', desc: 'Enter passenger passport information' },
                        { step: '3', icon: '📱', title: 'Pay', desc: 'Send payment via bKash and submit' },
                        { step: '4', icon: '📄', title: 'Download', desc: 'Get your PDF itinerary once approved' },
                    ].map(s => (
                        <div key={s.step} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-extrabold flex items-center justify-center mx-auto mb-3 shadow-sm shadow-indigo-200">{s.step}</div>
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className="text-sm font-bold text-gray-800">{s.title}</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
