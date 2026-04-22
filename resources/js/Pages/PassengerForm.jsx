import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '../Components/Layout';
import StepBar from '../Components/StepBar';

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
        <div className="group">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
            {children}
            {hint && !error && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
            {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
        </div>
    );
}

const inputCls = (hasError) =>
    `w-full border-2 rounded-xl px-3 py-2.5 text-sm transition-all outline-none
    ${hasError
        ? 'border-red-300 bg-red-50 focus:border-red-400'
        : 'border-gray-200 bg-white focus:border-indigo-500 focus:shadow-sm hover:border-gray-300'}`;

export default function PassengerForm({ flight, date, passengers }) {
    const initial = Array.from({ length: passengers }, blankPassenger);

    const { data, setData, post, processing, errors } = useForm({
        flight_id:     flight.id,
        travel_date:   date,
        contact_name:  '',
        contact_email: '',
        contact_phone: '',
        passengers:    initial,
    });

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

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Flight strip */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 mb-6 text-white shadow-lg shadow-indigo-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
                                <div className="text-xs text-indigo-200 font-medium">Flight</div>
                                <div className="font-bold">{flight.flight_number}</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
                                    <span>{flight.origin?.iata_code}</span>
                                    <span className="text-indigo-300 text-base">→</span>
                                    <span>{flight.destination?.iata_code}</span>
                                </div>
                                <div className="text-indigo-200 text-xs mt-0.5">{flight.airline?.name}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-indigo-200 text-xs">Travel Date</div>
                            <div className="font-bold">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div className="text-indigo-200 text-xs mt-1">{fmt(flight.departure_time)} → {fmt(flight.arrival_time)}</div>
                        </div>
                    </div>
                </div>

                {hasErrors && (
                    <div data-error-anchor className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <span className="text-red-500 text-lg mt-0.5">⚠</span>
                        <div>
                            <div className="text-red-700 font-semibold text-sm">Please fix the errors below</div>
                            <div className="text-red-500 text-xs mt-0.5">Check all highlighted fields and try again.</div>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Contact section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">@</div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">Contact Information</h3>
                                <p className="text-gray-400 text-xs">Your booking confirmation will be sent here</p>
                            </div>
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField label="Full Name" error={errors.contact_name} hint="As it appears on your ID">
                                <input className={inputCls(!!errors.contact_name)}
                                    value={data.contact_name}
                                    onChange={e => setData('contact_name', e.target.value)}
                                    placeholder="John Doe" />
                            </InputField>
                            <InputField label="Email Address" error={errors.contact_email}>
                                <input type="email" className={inputCls(!!errors.contact_email)}
                                    value={data.contact_email}
                                    onChange={e => setData('contact_email', e.target.value)}
                                    placeholder="you@example.com" />
                            </InputField>
                            <InputField label="Phone (optional)" error={errors.contact_phone}>
                                <input className={inputCls(!!errors.contact_phone)}
                                    value={data.contact_phone}
                                    onChange={e => setData('contact_phone', e.target.value)}
                                    placeholder="01XXXXXXXXX" />
                            </InputField>
                        </div>
                    </div>

                    {/* Passenger sections */}
                    {data.passengers.map((pax, idx) => {
                        const paxErrors = Object.keys(errors).some(k => k.startsWith(`passengers.${idx}.`));
                        return (
                            <div key={idx} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${paxErrors ? 'border-red-200' : 'border-gray-100'}`}>
                                <div className={`flex items-center justify-between px-5 py-4 border-b ${paxErrors ? 'bg-red-50 border-red-100' : 'bg-gray-50/50 border-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${paxErrors ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm">Passenger {idx + 1}</h3>
                                            <p className="text-gray-400 text-xs">Enter details exactly as on passport</p>
                                        </div>
                                    </div>
                                    {paxErrors && (
                                        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                                            <span>⚠</span> Fix errors
                                        </span>
                                    )}
                                </div>

                                <div className="p-5 space-y-4">
                                    {/* Row 1 */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <InputField label="Type" error={errors[`passengers.${idx}.type`]}>
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
                                                {TITLES.map(t => <option key={t}>{t}</option>)}
                                            </select>
                                        </InputField>
                                        <InputField label="First Name" error={errors[`passengers.${idx}.first_name`]}>
                                            <input className={inputCls(!!errors[`passengers.${idx}.first_name`])}
                                                value={pax.first_name}
                                                onChange={e => setPax(idx, 'first_name', e.target.value)}
                                                placeholder="First" />
                                        </InputField>
                                        <InputField label="Last Name" error={errors[`passengers.${idx}.last_name`]}>
                                            <input className={inputCls(!!errors[`passengers.${idx}.last_name`])}
                                                value={pax.last_name}
                                                onChange={e => setPax(idx, 'last_name', e.target.value)}
                                                placeholder="Last" />
                                        </InputField>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                                        <InputField label="Passport No." error={errors[`passengers.${idx}.passport_number`]} hint="Optional">
                                            <input className={`${inputCls(!!errors[`passengers.${idx}.passport_number`])} font-mono tracking-wider`}
                                                value={pax.passport_number}
                                                onChange={e => setPax(idx, 'passport_number', e.target.value)}
                                                placeholder="AB1234567" />
                                        </InputField>
                                        <InputField label="Passport Expiry" error={errors[`passengers.${idx}.passport_expiry`]} hint="Optional">
                                            <input type="date" className={inputCls(!!errors[`passengers.${idx}.passport_expiry`])}
                                                value={pax.passport_expiry}
                                                onChange={e => setPax(idx, 'passport_expiry', e.target.value)} />
                                        </InputField>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-60 text-base shadow-xl shadow-indigo-200"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Saving details…
                            </>
                        ) : (
                            <>
                                Continue to Payment
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </Layout>
    );
}
