import { useState } from 'react';
import { router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import AirportCombobox from '../Components/AirportCombobox';
import PassengerPicker from '../Components/PassengerPicker';

const TODAY = new Date().toISOString().split('T')[0];
const DAYS  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AIRLINE_COLORS = {
    BG: { bg: 'bg-red-600',    text: 'text-white' },
    BS: { bg: 'bg-green-600',  text: 'text-white' },
    VQ: { bg: 'bg-blue-600',   text: 'text-white' },
};

function AirlineBadge({ code, name }) {
    const c = AIRLINE_COLORS[code] ?? { bg: 'bg-indigo-600', text: 'text-white' };
    return (
        <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center font-bold text-xs flex-shrink-0`} title={name}>
            {code}
        </div>
    );
}

function FlightCard({ flight, onSelect }) {
    const [expanded, setExpanded] = useState(false);
    const fmt = t => t?.substring(0, 5) ?? '—';
    const dh  = flight.duration_hours   ?? 0;
    const dm  = flight.duration_minutes ?? 0;

    const travelDow = new Date().getDay(); // placeholder — server passes actual date context

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all overflow-hidden group">
            {/* Main row */}
            <div className="p-5 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <AirlineBadge code={flight.airline?.code} name={flight.airline?.name} />

                {/* Times + route */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-center min-w-[52px]">
                        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{fmt(flight.departure_time)}</div>
                        <div className="text-xs font-semibold text-indigo-500 mt-0.5">{flight.origin?.iata_code}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[60px]">{flight.origin?.city}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-2 min-w-[80px]">
                        <div className="text-xs text-gray-400 font-medium">{dh}h {dm > 0 ? `${dm}m` : ''}</div>
                        <div className="relative w-full flex items-center my-1">
                            <div className="flex-1 h-px bg-gray-200 group-hover:bg-indigo-200 transition-colors" />
                            <div className="mx-1 text-indigo-400 text-sm">✈</div>
                            <div className="flex-1 h-px bg-gray-200 group-hover:bg-indigo-200 transition-colors" />
                        </div>
                        <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Direct</div>
                    </div>

                    <div className="text-center min-w-[52px]">
                        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{fmt(flight.arrival_time)}</div>
                        <div className="text-xs font-semibold text-indigo-500 mt-0.5">{flight.destination?.iata_code}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[60px]">{flight.destination?.city}</div>
                    </div>
                </div>

                {/* Airline name + operates */}
                <div className="hidden sm:block text-right flex-shrink-0 min-w-[110px]">
                    <div className="text-sm font-medium text-gray-700">{flight.airline?.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{flight.flight_number}</div>
                    {flight.aircraft_type && <div className="text-xs text-gray-400">{flight.aircraft_type}</div>}
                </div>

                {/* Select button */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                        onClick={() => onSelect(flight)}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-indigo-100"
                    >
                        Select →
                    </button>
                    <button
                        type="button"
                        onClick={() => setExpanded(v => !v)}
                        className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
                    >
                        {expanded ? 'Less ▲' : 'Details ▼'}
                    </button>
                </div>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="border-t border-gray-50 bg-gray-50/50 px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Cabin</div>
                        <div className="font-medium text-gray-700">{flight.cabin_class ?? 'Economy'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Aircraft</div>
                        <div className="font-medium text-gray-700">{flight.aircraft_type || '—'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Flight #</div>
                        <div className="font-mono font-medium text-gray-700">{flight.flight_number}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Operates</div>
                        <div className="flex gap-1">
                            {DAYS.map((d, i) => (
                                <span key={i} className={`text-xs w-6 h-6 rounded flex items-center justify-center font-medium ${flight.operates_on?.includes(i) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-300'}`}>
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
        router.get('/book', { flight_id: flight.id, date: searchDate, passengers: searchPax });
    }

    function reSearch(e) {
        e.preventDefault();
        const total = pax.adults + pax.children + pax.infants;
        router.get('/search', { origin, destination: dest, date, passengers: total });
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Compact search bar */}
            <div className="mb-6">
                <div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between cursor-pointer hover:border-indigo-200 transition-colors"
                    onClick={() => setEditOpen(v => !v)}
                >
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="font-bold text-[#1a1a2e]">
                            {originAirport?.city} <span className="text-gray-400 font-normal">({originAirport?.iata_code})</span>
                            <span className="mx-2 text-indigo-400">→</span>
                            {destAirport?.city} <span className="text-gray-400 font-normal">({destAirport?.iata_code})</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><span>📅</span> {dateLabel}</span>
                            <span className="flex items-center gap-1"><span>👤</span> {searchPax} Pax</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-indigo-500 font-medium">{editOpen ? 'Close' : 'Edit search'}</span>
                        <svg className={`w-4 h-4 text-indigo-400 transition-transform ${editOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Expanded edit form */}
                {editOpen && (
                    <form onSubmit={reSearch} className="mt-2 bg-white rounded-2xl shadow-sm border border-indigo-100 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">From</label>
                            <AirportCombobox airports={airports ?? []} value={origin} onChange={setOrigin} placeholder="Origin" exclude={dest} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">To</label>
                            <AirportCombobox airports={airports ?? []} value={dest} onChange={setDest} placeholder="Destination" exclude={origin} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                            <div className="flex items-center border-2 rounded-xl px-3 py-2.5 border-gray-200 focus-within:border-indigo-500 bg-white">
                                <span className="text-gray-400 text-lg mr-2">📅</span>
                                <input type="date" min={TODAY} value={date} onChange={e => setDate(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Passengers</label>
                            <PassengerPicker value={pax} onChange={setPax} />
                        </div>
                        <div className="sm:col-span-2">
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition">
                                Search Again
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a2e]">
                        {originAirport?.city} → {destAirport?.city}
                    </h2>
                    <p className="text-gray-500 text-sm">{dateLabel} · {searchPax} Passenger{searchPax > 1 ? 's' : ''}</p>
                </div>
                <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{flights.length}</span> flight{flights.length !== 1 ? 's' : ''} found
                </div>
            </div>

            {flights.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="text-5xl mb-4">✈️</div>
                    <h3 className="font-bold text-gray-700 text-lg mb-1">No flights found</h3>
                    <p className="text-gray-400 text-sm mb-5">No flights operate on this route for the selected date. Try a different date.</p>
                    <button
                        onClick={() => setEditOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl"
                    >
                        Modify Search
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {flights.map(flight => (
                        <FlightCard key={flight.id} flight={flight} onSelect={select} />
                    ))}
                </div>
            )}
            </div>
        </Layout>
    );
}
