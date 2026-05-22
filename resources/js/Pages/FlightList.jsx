import { useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import AirportCombobox from '../Components/AirportCombobox';
import PassengerPicker from '../Components/PassengerPicker';

const TODAY = new Date().toISOString().split('T')[0];
const DAYS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AIRLINE_STYLING = {
    BG: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    BS: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    VQ: { color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
    default: { color: 'text-navy', bg: 'bg-slate-50', border: 'border-slate-200' }
};

// Free airline-logo CDN keyed by IATA code (covers BD + international carriers).
const airlineLogoUrl = code => (code ? `https://pics.avs.io/100/100/${code}.png` : null);

function AirlineBadge({ code, name, logo }) {
    const s = AIRLINE_STYLING[code] ?? AIRLINE_STYLING.default;
    const [imgOk, setImgOk] = useState(true);
    const src = logo || airlineLogoUrl(code);

    return (
        <div className="flex items-center gap-4" title={name}>
            <div className={`w-16 h-16 md:w-17 md:h-17 rounded-2xl bg-white border ${s.border} flex items-center justify-center overflow-hidden shadow-sm shrink-0 p-2.5`}>
                {src && imgOk ? (
                    <img
                        src={src}
                        alt={`${name ?? code} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={() => setImgOk(false)}
                    />
                ) : (
                    <span className={`font-black text-xl ${s.color}`}>{code}</span>
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-slate-900 font-extrabold text-base leading-tight">{name}</span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{code} · Non-stop</span>
            </div>
        </div>
    );
}

function FlightCard({ flight, onSelect }) {
    const [expanded, setExpanded] = useState(false);
    const fmt = t => t?.substring(0, 5) ?? '—';
    const dh  = flight.duration_hours   ?? 0;
    const dm  = flight.duration_minutes ?? 0;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-brand hover:shadow-xl transition-all overflow-hidden group">
            <div className="p-6 flex flex-col md:flex-row items-center gap-8">
                {/* Airline Info */}
                <div className="flex-shrink-0 w-full md:w-auto">
                    <AirlineBadge code={flight.airline?.code} name={flight.airline?.name} logo={flight.airline?.logo_url} />
                </div>

                {/* Times + Route Visual */}
                <div className="flex items-center justify-between flex-1 gap-4 md:gap-6 w-full order-1 md:order-none">
                    <div className="text-left">
                        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{fmt(flight.departure_time)}</div>
                        <div className="flex flex-col">
                            <span className="text-brand font-black text-[11px] md:text-sm uppercase tracking-wider leading-none mb-1">{flight.origin?.iata_code}</span>
                            <span className="text-slate-400 text-[10px] md:text-[11px] font-bold uppercase truncate max-w-[80px] md:max-w-[100px]">{flight.origin?.city}</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center min-w-[80px] md:min-w-[120px]">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{dh}H {dm > 0 ? `${dm}M` : ''}</div>
                        <div className="relative w-full flex items-center px-2">
                            <div className="flex-1 h-[2px] bg-slate-100 group-hover:bg-brand/20 transition-colors" />
                            <div className="mx-1 md:mx-2 text-brand transform rotate-90 group-hover:scale-125 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                            </div>
                            <div className="flex-1 h-[2px] bg-slate-100 group-hover:bg-brand/20 transition-colors" />
                        </div>
                        <div className="mt-2 hidden md:flex items-center gap-1.5 text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            Non-stop
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{fmt(flight.arrival_time)}</div>
                        <div className="flex flex-col items-end">
                            <span className="text-brand font-black text-[11px] md:text-sm uppercase tracking-wider leading-none mb-1">{flight.destination?.iata_code}</span>
                            <span className="text-slate-400 text-[10px] md:text-[11px] font-bold uppercase truncate max-w-[80px] md:max-w-[100px]">{flight.destination?.city}</span>
                        </div>
                    </div>
                </div>

                {/* Price/Action Section */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                    <div className="flex flex-col items-start md:items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flight #</span>
                        <span className="text-slate-900 font-black text-lg tracking-tight">{flight.flight_number}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setExpanded(v => !v)}
                            className="p-3.5 rounded-2xl border-2 border-slate-100 text-slate-400 hover:text-brand hover:border-brand transition-all active:scale-95 flex items-center justify-center"
                            title="View Flight Details"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                        <button
                            onClick={() => onSelect(flight)}
                            className="bg-navy hover:bg-navy-light text-white font-black px-6 py-3.5 rounded-2xl text-sm transition-all shadow-xl shadow-navy/10 active:scale-95 flex items-center gap-2"
                        >
                            Select
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="bg-slate-50 border-t border-slate-100 p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Class</div>
                        <div className="font-black text-slate-900 text-sm">{flight.cabin_class ?? 'Premium Economy'}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aircraft Model</div>
                        <div className="font-black text-slate-900 text-sm">{flight.aircraft_type || 'Airbus A320'}</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</div>
                        <div className="flex items-center gap-2 font-black text-emerald-600 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Confirmed Schedule
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation Days</div>
                        <div className="flex gap-1.5">
                            {DAYS.map((d, i) => (
                                <span key={i} className={`text-[10px] w-7 h-7 rounded-lg flex items-center justify-center font-black transition-all ${flight.operates_on?.includes(i) ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white text-slate-300 border border-slate-100'}`}>
                                    {d[0]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FlightList({ flights, origin: originAirport, destination: destAirport, date: searchDate, passengers: searchPax, airports }) {
    const [editOpen, setEditOpen] = useState(false);
    const [origin, setOrigin]     = useState(originAirport?.iata_code ?? '');
    const [dest, setDest]         = useState(destAirport?.iata_code ?? '');
    const [date, setDate]         = useState(searchDate ?? '');
    const [pax, setPax]           = useState({ adults: Math.max(1, searchPax ?? 1), children: 0, infants: 0 });

    const dateLabel = searchDate
        ? new Date(searchDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    function select(flight) {
        const total = pax.adults + pax.children + pax.infants;
        router.get('/book', { flight_id: flight.id, date: searchDate, passengers: total });
    }

    function reSearch(e) {
        e.preventDefault();
        const total = pax.adults + pax.children + pax.infants;
        router.get('/search', { origin, destination: dest, date, passengers: total });
    }

    return (
        <Layout>
            {/* Header Background */}
            <div className="bg-navy pt-8 pb-16">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                {originAirport?.city} <span className="text-brand">→</span> {destAirport?.city}
                            </h2>
                            <span className="bg-white/10 text-brand text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                                Round Trip
                            </span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 font-bold text-sm">
                            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>{dateLabel}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>{searchPax} Passengers</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditOpen(v => !v)}
                        className="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-navy font-black px-5 py-3 rounded-2xl transition-all shadow-xl shadow-black/20 group active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        Modify Search
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${editOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 mb-20">
                {/* Search modifier form */}
                {editOpen && (
                    <form onSubmit={reSearch} className="mb-12 glass rounded-3xl p-1.5 border-white/20 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-white rounded-[1.4rem] p-8 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                <div className="md:col-span-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">From</label>
                                    <AirportCombobox airports={airports ?? []} value={origin} onChange={setOrigin} placeholder="Origin" exclude={dest} />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">To</label>
                                    <AirportCombobox airports={airports ?? []} value={dest} onChange={setDest} placeholder="Destination" exclude={origin} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date</label>
                                    <div className="flex items-center bg-slate-50 border-2 border-transparent focus-within:border-brand rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mr-3"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                                        <input type="date" min={TODAY} value={date} onChange={e => setDate(e.target.value)} className="bg-transparent outline-none w-full" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Travelers</label>
                                    <PassengerPicker value={pax} onChange={setPax} />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="w-full bg-navy hover:bg-navy-light text-white font-black py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* Results Control */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-brand rounded-full" />
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Available Departures</h3>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        {flights.length} Options Found
                    </div>
                </div>

                {flights.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-20 text-center shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 22 2"/><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.2.3-2.4 1.4l-.4 1.8L10 13l-4.7 4.7-2.8-.5c-.7-.1-1.4.3-1.6 1L.5 19.5c-.1.5.1 1 .5 1.3.3.3.8.4 1.3.3l1.3-.4c.7-.2 1.1-.9 1-1.6l-.5-2.8 4.7-4.7 3.1 7.5.9-.2c1.1-.3 1.7-1.4 1.4-2.5l-.2-1.2Z"/></svg>
                        </div>
                        <h3 className="font-black text-slate-900 text-2xl mb-3">No Flights Available</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">We couldn't find any scheduled flights for this route on your selected date. Please try adjusting your travel dates.</p>
                        <button
                            onClick={() => setEditOpen(true)}
                            className="bg-navy hover:bg-navy-light text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-navy/20 active:scale-95"
                        >
                            Modify Search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {flights.map(flight => (
                            <FlightCard key={flight.id} flight={flight} onSelect={select} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
