import Layout from '../../Components/Layout';

const STATUS_COLORS = {
    pending:           'bg-amber-50 text-amber-600 border-amber-100',
    payment_submitted: 'bg-blue-50 text-blue-600 border-blue-100',
    approved:          'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected:          'bg-rose-50 text-rose-600 border-rose-100',
    cancelled:         'bg-slate-50 text-slate-400 border-slate-100',
};

const STATUS_LABELS = {
    pending:           'Pending Verification',
    payment_submitted: 'Processing',
    approved:          'Approved',
    rejected:          'Rejected',
    cancelled:         'Cancelled',
};

export default function BookingShow({ order, flash }) {
    const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="flex items-start justify-between mb-12 flex-wrap gap-6">
                    <div>
                        <a href="/my-bookings" className="inline-flex items-center gap-2 text-slate-400 hover:text-navy text-[10px] font-black uppercase tracking-widest mb-4 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            Back to Bookings
                        </a>
                        <h1 className="text-4xl font-black text-navy tracking-tight leading-none">Reservation {order.reference}</h1>
                    </div>
                    <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] border shadow-sm ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                    </div>
                </div>

                {flash?.success && <div className="mb-8 px-6 py-4 rounded-[1.5rem] text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-2">{flash.success}</div>}
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-8">
                        {/* Status Message */}
                        {order.status === 'rejected' && order.admin_note && (
                            <div className="bg-rose-50 rounded-[2rem] p-8 border border-rose-100 shadow-sm">
                                <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Rejection Reason</div>
                                <p className="text-rose-900 font-bold leading-relaxed">{order.admin_note}</p>
                            </div>
                        )}

                        {order.status === 'approved' && (
                            <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-200/50">
                                <h3 className="text-2xl font-black mb-2">Itinerary is Ready</h3>
                                <p className="text-emerald-50 text-sm font-medium mb-8">Your reservation has been confirmed and verified. You can now download the PDF for your visa application.</p>
                                <a href={`/my-bookings/${order.reference}/download`}
                                    className="inline-flex items-center gap-3 bg-white text-emerald-700 font-black px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg active:scale-95">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                    Download PDF Itinerary
                                </a>
                            </div>
                        )}

                        {order.status === 'pending' && (
                            <div className="bg-navy rounded-[2rem] p-8 text-white shadow-xl shadow-navy/20">
                                <h3 className="text-2xl font-black mb-2">Verification in Progress</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Our team is currently verifying your reservation details. This usually takes between 15–30 minutes. You will be able to download the document once approved.
                                </p>
                            </div>
                        )}

                        {/* Passengers */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-black text-navy text-lg tracking-tight">Passenger Details</h3>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.passengers?.length} Person(s)</div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {order.passengers?.map((p, i) => (
                                    <div key={p.id} className="p-8 flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className="w-12 h-12 rounded-[1.2rem] bg-navy text-white flex items-center justify-center font-black text-lg flex-shrink-0">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-lg font-black text-navy mb-1">{p.title ? `${p.title}. ` : ''}{p.first_name} {p.last_name}</div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                                <span>{p.type}</span>
                                                <span className="text-slate-200">|</span>
                                                <span>DOB: {fmt(p.date_of_birth)}</span>
                                                <span className="text-slate-200">|</span>
                                                <span>{p.nationality}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Passport No.</div>
                                            <div className="font-mono font-black text-navy text-sm tracking-wider uppercase">{p.passport_number || 'NOT PROVIDED'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        {/* Flight Summary Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-32">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flight No.</div>
                                        <div className="font-mono font-black text-navy text-xl tracking-wider">{order.flight?.flight_number}</div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Airline</div>
                                        <div className="font-black text-navy">{order.flight?.airline?.name}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-navy leading-none mb-1">{order.flight?.origin?.iata_code}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.flight?.origin?.city}</div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center gap-1 opacity-20">
                                        <div className="w-full h-[2px] bg-navy relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-navy">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-navy leading-none mb-1">{order.flight?.destination?.iata_code}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.flight?.destination?.city}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Travel Date</div>
                                        <div className="font-black text-navy">{fmt(order.travel_date)}</div>
                                        <div className="text-brand font-black text-xs uppercase tracking-tight">{order.flight?.departure_time}</div>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cabin Class</div>
                                        <div className="font-black text-navy capitalize">{order.flight?.cabin_class ?? 'Economy'}</div>
                                        <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Confirmed</div>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Info</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                            </div>
                                            <div className="text-sm font-bold text-navy">{order.contact_name}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                            </div>
                                            <div className="text-sm font-bold text-navy">{order.contact_email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
