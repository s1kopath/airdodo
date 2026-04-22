import { useState, useRef, useEffect } from 'react';

export default function PassengerPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        function handler(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const total = value.adults + value.children + value.infants;
    const label = `${total} Passenger${total !== 1 ? 's' : ''}`;

    function adjust(type, delta) {
        const next = { ...value, [type]: Math.max(mins[type], (value[type] ?? 0) + delta) };
        // At least 1 adult always
        if (next.adults < 1) next.adults = 1;
        // Infants cannot exceed adults
        if (next.infants > next.adults) next.infants = next.adults;
        // Total max 9
        const tot = next.adults + next.children + next.infants;
        if (tot > 9) return;
        onChange(next);
    }

    const mins = { adults: 1, children: 0, infants: 0 };

    const rows = [
        { key: 'adults',   label: 'Adults',   sub: '12+ years' },
        { key: 'children', label: 'Children', sub: '2–11 years' },
        { key: 'infants',  label: 'Infants',  sub: 'Under 2' },
    ];

    return (
        <div ref={wrapRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={`w-full flex items-center gap-2 border-2 rounded-xl px-3 py-2.5 text-left transition-all bg-white ${open ? 'border-indigo-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <span className="text-gray-400 text-lg">👤</span>
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400">
                        {[
                            value.adults > 0 && `${value.adults} Adult${value.adults > 1 ? 's' : ''}`,
                            value.children > 0 && `${value.children} Child${value.children > 1 ? 'ren' : ''}`,
                            value.infants > 0 && `${value.infants} Infant${value.infants > 1 ? 's' : ''}`,
                        ].filter(Boolean).join(', ')}
                    </div>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-50 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
                    <div className="space-y-4">
                        {rows.map(({ key, label, sub }) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{label}</div>
                                    <div className="text-xs text-gray-400">{sub}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => adjust(key, -1)}
                                        disabled={value[key] <= mins[key]}
                                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-light leading-none"
                                    >
                                        −
                                    </button>
                                    <span className="w-4 text-center text-sm font-semibold text-gray-800">{value[key]}</span>
                                    <button
                                        type="button"
                                        onClick={() => adjust(key, 1)}
                                        disabled={value.adults + value.children + value.infants >= 9}
                                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-light leading-none"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 text-center">
                        Max 9 passengers · Infants must not exceed adults
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
}
