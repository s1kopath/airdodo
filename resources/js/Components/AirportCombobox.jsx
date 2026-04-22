import { useState, useRef, useEffect } from 'react';

const COUNTRY_FLAGS = {
    BD: '🇧🇩', AE: '🇦🇪', QA: '🇶🇦', KW: '🇰🇼',
    OM: '🇴🇲', SA: '🇸🇦', MY: '🇲🇾', SG: '🇸🇬',
    TH: '🇹🇭', GB: '🇬🇧', CA: '🇨🇦', US: '🇺🇸',
};

export default function AirportCombobox({ airports, value, onChange, placeholder, exclude }) {
    const [query, setQuery]     = useState('');
    const [open, setOpen]       = useState(false);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);
    const wrapRef  = useRef(null);

    const selected = airports.find(a => a.iata_code === value) ?? null;

    const filtered = query.trim().length === 0
        ? airports.filter(a => a.iata_code !== exclude)
        : airports.filter(a =>
            a.iata_code !== exclude &&
            (
                a.iata_code.toLowerCase().includes(query.toLowerCase()) ||
                a.city.toLowerCase().includes(query.toLowerCase()) ||
                a.name.toLowerCase().includes(query.toLowerCase()) ||
                a.country.toLowerCase().includes(query.toLowerCase())
            )
        );

    // Group into Bangladesh vs International
    const bd   = filtered.filter(a => a.country === 'BD');
    const intl = filtered.filter(a => a.country !== 'BD');

    useEffect(() => {
        function onClickOutside(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    function select(airport) {
        onChange(airport.iata_code);
        setQuery('');
        setOpen(false);
        inputRef.current?.blur();
    }

    function clear(e) {
        e.stopPropagation();
        onChange('');
        setQuery('');
        setTimeout(() => { inputRef.current?.focus(); setOpen(true); }, 0);
    }

    function onFocus() {
        setFocused(true);
        setOpen(true);
    }

    function onBlur() {
        setFocused(false);
    }

    const displayValue = focused ? query : (selected ? `${selected.city} (${selected.iata_code})` : '');

    return (
        <div ref={wrapRef} className="relative">
            <div
                className={`flex items-center border-2 rounded-xl px-3 py-2.5 cursor-text transition-all ${open || focused ? 'border-indigo-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'} bg-white`}
                onClick={() => { inputRef.current?.focus(); setOpen(true); }}
            >
                <span className="text-gray-400 mr-2 text-lg flex-shrink-0">
                    {selected ? (COUNTRY_FLAGS[selected.country] ?? '🌍') : '📍'}
                </span>
                <div className="flex-1 min-w-0">
                    <input
                        ref={inputRef}
                        className="w-full bg-transparent outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                        placeholder={placeholder}
                        value={displayValue}
                        onChange={e => { setQuery(e.target.value); setOpen(true); }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                    {selected && !focused && (
                        <div className="text-xs text-gray-400 truncate leading-tight">{selected.name}</div>
                    )}
                </div>
                {selected && (
                    <button
                        type="button"
                        onMouseDown={clear}
                        className="ml-1 text-gray-300 hover:text-gray-500 flex-shrink-0 text-lg leading-none"
                    >
                        ×
                    </button>
                )}
            </div>

            {open && (
                <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-72 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">No airports found</div>
                    ) : (
                        <>
                            {bd.length > 0 && (
                                <>
                                    <div className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Bangladesh</div>
                                    {bd.map(a => <AirportOption key={a.id} airport={a} onSelect={select} />)}
                                </>
                            )}
                            {intl.length > 0 && (
                                <>
                                    <div className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">International</div>
                                    {intl.map(a => <AirportOption key={a.id} airport={a} onSelect={select} />)}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function AirportOption({ airport, onSelect }) {
    return (
        <button
            type="button"
            onMouseDown={() => onSelect(airport)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 text-left transition-colors"
        >
            <span className="text-xl w-7 flex-shrink-0">{COUNTRY_FLAGS[airport.country] ?? '🌍'}</span>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-800">{airport.iata_code}</span>
                    <span className="text-sm text-gray-600 truncate">{airport.city}</span>
                </div>
                <div className="text-xs text-gray-400 truncate">{airport.name}</div>
            </div>
        </button>
    );
}
