import { useForm, Head } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function BookingEdit({ order, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        contact_name:  order.contact_name,
        contact_email: order.contact_email,
        contact_phone: order.contact_phone ?? '',
        passengers:    order.passengers.map(p => ({
            id:              p.id,
            type:            p.type,
            title:           p.title ?? '',
            first_name:      p.first_name,
            last_name:       p.last_name,
            date_of_birth:   p.date_of_birth?.split('T')[0] ?? '',
            nationality:     p.nationality,
            passport_number: p.passport_number ?? '',
            passport_expiry: p.passport_expiry?.split('T')[0] ?? '',
        })),
    });

    const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    function submit(e) {
        e.preventDefault();
        put(`/my-bookings/${order.reference}`);
    }

    function setPax(i, field, value) {
        const updated = [...data.passengers];
        updated[i] = { ...updated[i], [field]: value };
        setData('passengers', updated);
    }

    return (
        <Layout>
            <Head title={`Edit Booking ${order.reference}`} />
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <a href={`/my-bookings/${order.reference}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-navy text-[10px] font-black uppercase tracking-widest mb-4 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Cancel Editing
                    </a>
                    <h1 className="text-4xl font-black text-navy tracking-tight leading-none mb-2">Edit Reservation</h1>
                    <p className="text-slate-500 font-medium">Ref #<span className="font-mono text-brand font-black ml-1">{order.reference}</span> · {order.flight?.origin?.iata_code} → {order.flight?.destination?.iata_code} · {fmt(order.travel_date)}</p>
                </div>

                {flash?.error && <div className="mb-8 px-6 py-4 rounded-[1.5rem] text-sm font-bold bg-rose-50 text-rose-700 border border-rose-100 shadow-sm">{flash.error}</div>}

                <form onSubmit={submit} className="space-y-8">
                    {/* Contact Info */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-black text-navy text-lg tracking-tight">Contact Information</h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none"
                                    value={data.contact_name} onChange={e => setData('contact_name', e.target.value)} />
                                {errors.contact_name && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">{errors.contact_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none"
                                    value={data.contact_email} onChange={e => setData('contact_email', e.target.value)} />
                                {errors.contact_email && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">{errors.contact_email}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none"
                                    value={data.contact_phone} onChange={e => setData('contact_phone', e.target.value)} />
                                {errors.contact_phone && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">{errors.contact_phone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 ml-2">
                            <div className="w-2 h-8 bg-brand rounded-full" />
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Passenger Details</h3>
                        </div>
                        
                        {data.passengers.map((p, i) => (
                            <div key={p.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                                    <div className="text-[10px] font-black text-brand uppercase tracking-widest">Passenger {i + 1}</div>
                                </div>
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                            <select className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none appearance-none"
                                                value={p.type} onChange={e => setPax(i, 'type', e.target.value)}>
                                                <option value="adult">Adult</option>
                                                <option value="child">Child</option>
                                                <option value="infant">Infant</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                            <select className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none appearance-none"
                                                value={p.title} onChange={e => setPax(i, 'title', e.target.value)}>
                                                <option value="">Select Title</option>
                                                {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                            <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none"
                                                value={p.first_name} onChange={e => setPax(i, 'first_name', e.target.value)} />
                                            {errors[`passengers.${i}.first_name`] && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">Required</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                            <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none"
                                                value={p.last_name} onChange={e => setPax(i, 'last_name', e.target.value)} />
                                            {errors[`passengers.${i}.last_name`] && <p className="text-rose-500 text-[10px] font-black uppercase ml-1">Required</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                            <input type="date" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none"
                                                value={p.date_of_birth} onChange={e => setPax(i, 'date_of_birth', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nationality</label>
                                            <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none uppercase"
                                                maxLength={2} value={p.nationality} onChange={e => setPax(i, 'nationality', e.target.value.toUpperCase())} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passport Number</label>
                                            <input className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-3.5 font-bold text-navy transition-all outline-none font-mono"
                                                value={p.passport_number} onChange={e => setPax(i, 'passport_number', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passport Expiry</label>
                                            <input type="date" className="w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none"
                                                value={p.passport_expiry} onChange={e => setPax(i, 'passport_expiry', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={processing}
                            className="bg-navy hover:bg-navy-light text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-navy/20 active:scale-95 disabled:opacity-50 flex items-center gap-3">
                            {processing ? (
                                <svg className="animate-spin w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            ) : null}
                            {processing ? 'Saving Changes...' : 'Update Reservation'}
                        </button>
                        <a href={`/my-bookings/${order.reference}`} 
                            className="bg-white border-2 border-slate-100 text-slate-400 font-black px-10 py-5 rounded-2xl hover:text-navy hover:border-navy transition-all active:scale-95">
                            Discard Changes
                        </a>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
