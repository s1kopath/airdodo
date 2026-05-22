import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SOURCE_META = {
    static:  { label: 'Static',             color: 'bg-gray-100 text-gray-600' },
    scraped: { label: 'Live (AeroDataBox)', color: 'bg-blue-100 text-blue-700' },
};

const AIRLINE_COLORS = {
    BG: 'bg-red-600',
    BS: 'bg-green-600',
    VQ: 'bg-blue-600',
    EK: 'bg-red-500',
    QR: 'bg-purple-700',
    EY: 'bg-amber-500',
    FZ: 'bg-red-400',
    G9: 'bg-orange-500',
    KU: 'bg-blue-800',
    WY: 'bg-red-800',
    SV: 'bg-green-700',
    GF: 'bg-blue-500',
    MH: 'bg-blue-700',
    SQ: 'bg-amber-600',
    TG: 'bg-purple-600',
    AI: 'bg-orange-600',
    UL: 'bg-sky-700',
    CZ: 'bg-sky-500',
};

function StatCard({ label, value, sub, color = 'indigo' }) {
    const colors = {
        indigo:  'from-indigo-500 to-indigo-700',
        emerald: 'from-emerald-500 to-emerald-700',
        blue:    'from-blue-500 to-blue-700',
        gray:    'from-gray-500 to-gray-700',
        violet:  'from-violet-500 to-violet-700',
    };
    return (
        <div className={`rounded-2xl bg-gradient-to-br ${colors[color]} text-white p-5 flex flex-col gap-1`}>
            <div className="text-3xl font-bold">{value ?? '—'}</div>
            <div className="text-sm font-medium opacity-90">{label}</div>
            {sub && <div className="text-xs opacity-70 mt-0.5">{sub}</div>}
        </div>
    );
}

function AirlineBadge({ code }) {
    const bg = AIRLINE_COLORS[code] ?? 'bg-gray-500';
    return (
        <span className={`inline-flex items-center justify-center w-9 h-6 rounded text-white text-xs font-bold font-mono ${bg}`}>
            {code}
        </span>
    );
}

function SourceBadge({ source }) {
    const meta = SOURCE_META[source] ?? { label: source, color: 'bg-gray-100 text-gray-600' };
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
            {meta.label}
        </span>
    );
}

export default function AdminFlights({ flights, stats, airlines, filters, flash, sync: syncInfo }) {
    const { data, setData, get } = useForm({
        search:  filters?.search  ?? '',
        source:  filters?.source  ?? '',
        airline: filters?.airline ?? '',
    });

    function search(e) {
        e.preventDefault();
        get('/admin/flights', { preserveState: true, replace: true });
    }

    function setFilter(field, value) {
        setData(field, value);
        router.get('/admin/flights', { ...data, [field]: value }, { preserveState: true, replace: true });
    }

    const canSync = syncInfo?.can_sync ?? true;

    function sync() {
        if (!canSync) {
            alert(`Daily sync limit reached (${syncInfo?.used}/${syncInfo?.limit}). Please try again tomorrow.`);
            return;
        }
        if (!confirm('Run flight data sync? This may take up to a minute.')) return;
        router.post('/admin/flights/sync');
    }

    function toggle(flight) {
        router.post(`/admin/flights/${flight.id}/toggle`);
    }

    const lastSynced = stats?.last_synced
        ? new Date(stats.last_synced).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : 'Never';

    return (
        <AdminLayout title="Flight Management">
            {flash?.success && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200">{flash.success}</div>
            )}
            {flash?.error && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">{flash.error}</div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                <StatCard label="Total Flights"  value={stats?.total}   color="indigo" />
                <StatCard label="Active"          value={stats?.active}  color="emerald" />
                <StatCard label="Static Data"     value={stats?.static}  color="gray" />
                <StatCard label="Live (AeroDataBox)" value={stats?.scraped} color="blue" />
                <StatCard label="Last Synced"     value={lastSynced}     color="gray" sub="UTC+6" />
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-5 flex-wrap items-end">
                <form onSubmit={search} className="flex gap-2 flex-1 min-w-56">
                    <input
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Flight #, airline, city…"
                        value={data.search}
                        onChange={e => setData('search', e.target.value)}
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap">
                        Search
                    </button>
                </form>

                <select
                    value={data.source}
                    onChange={e => setFilter('source', e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                    <option value="">All Sources</option>
                    {Object.entries(SOURCE_META).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>

                <select
                    value={data.airline}
                    onChange={e => setFilter('airline', e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                    <option value="">All Airlines</option>
                    {airlines?.map(a => (
                        <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
                    ))}
                </select>

                <div className="flex flex-col items-end gap-1">
                    <button
                        onClick={sync}
                        disabled={!canSync}
                        title={canSync ? 'Run flight data sync' : 'Daily sync limit reached'}
                        className={`text-white text-sm px-5 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
                            canSync ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        <span className="text-base leading-none">⟳</span> Sync Now
                    </button>
                    {syncInfo && (
                        <span className={`text-xs ${canSync ? 'text-gray-400' : 'text-red-500 font-medium'}`}>
                            {canSync
                                ? `${syncInfo.remaining} of ${syncInfo.limit} syncs left today`
                                : `Daily limit reached (${syncInfo.used}/${syncInfo.limit})`}
                        </span>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Airline', 'Flight #', 'Route', 'Departure', 'Arrival', 'Duration', 'Operates', 'Source', 'Status', ''].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {flights.data.map(flight => (
                                <tr key={flight.id} className={`hover:bg-gray-50 transition-colors ${!flight.is_active ? 'opacity-40' : ''}`}>
                                    <td className="px-4 py-3">
                                        <AirlineBadge code={flight.airline?.code} />
                                    </td>
                                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                                        {flight.flight_number}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-gray-800">{flight.origin?.iata_code}</span>
                                            <span className="text-gray-300 text-xs">→</span>
                                            <span className="font-semibold text-gray-800">{flight.destination?.iata_code}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {flight.origin?.city} → {flight.destination?.city}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap font-medium">{flight.departure_time}</td>
                                    <td className="px-4 py-3 whitespace-nowrap font-medium">{flight.arrival_time}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                                        {flight.duration_hours}h {flight.duration_minutes > 0 ? `${flight.duration_minutes}m` : ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-0.5">
                                            {DAYS.map((d, i) => (
                                                <span
                                                    key={i}
                                                    title={DAY_LABELS[i]}
                                                    className={`text-xs w-5 h-5 flex items-center justify-center rounded ${
                                                        flight.operates_on?.includes(i)
                                                            ? 'bg-indigo-600 text-white font-bold'
                                                            : 'bg-gray-100 text-gray-300'
                                                    }`}
                                                >
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <SourceBadge source={flight.source} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            flight.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
                                        }`}>
                                            {flight.is_active ? 'Active' : 'Off'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggle(flight)}
                                            className={`text-xs font-medium hover:underline whitespace-nowrap ${
                                                flight.is_active ? 'text-red-500' : 'text-emerald-600'
                                            }`}
                                        >
                                            {flight.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {flights.data.length === 0 && (
                        <div className="text-center py-14 text-gray-400">
                            <div className="text-4xl mb-3">✈️</div>
                            <p className="text-sm">No flights found.</p>
                            {!filters?.search && !filters?.source && (
                                <button onClick={sync} className="mt-3 text-sm text-emerald-600 hover:underline font-medium">
                                    Run sync to import flight data →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {flights.links && flights.last_page > 1 && (
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                    {flights.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                link.active
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            } disabled:opacity-40`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Source legend */}
            <div className="mt-6 flex flex-wrap gap-3 items-center">
                <span className="text-xs text-gray-400 font-medium">Sources:</span>
                {Object.entries(SOURCE_META).map(([key, { label, color }]) => (
                    <span key={key} className={`text-xs px-2 py-1 rounded-full font-medium ${color}`}>{label}</span>
                ))}
            </div>
        </AdminLayout>
    );
}
