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

export default function BookingList({ orders }) {
    const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-navy tracking-tight mb-2">My Bookings</h1>
                        <p className="text-slate-500 font-medium">Manage your flight itineraries and documents</p>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        {orders.length} Reservations Found
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="19" x2="13" y2="19"/></svg>
                        </div>
                        <h3 className="text-xl font-black text-navy mb-2">No Bookings Yet</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">You haven't made any flight reservations yet. Start your journey today!</p>
                        <a href="/" className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-black px-8 py-3.5 rounded-2xl transition-all active:scale-95">
                            Search Flights
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="group bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col md:flex-row md:items-center gap-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="font-mono font-black text-brand text-sm tracking-widest">{order.reference}</span>
                                    </div>
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-navy leading-none mb-1">{order.flight?.origin?.iata_code}</div>
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
                                            <div className="text-2xl font-black text-navy leading-none mb-1">{order.flight?.destination?.iata_code}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.flight?.destination?.city}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500 font-bold text-xs">
                                        <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>{fmt(order.travel_date)}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                        <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>{order.passengers_count} Person(s)</span>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-3">
                                    <a href={`/my-bookings/${order.reference}`}
                                        className="flex-1 md:w-40 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest py-3 rounded-xl text-center transition-all">
                                        Details
                                    </a>
                                    <a href={`/my-bookings/${order.reference}/edit`}
                                        className="flex-1 md:w-40 bg-navy hover:bg-navy-light text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl text-center shadow-lg shadow-navy/10 transition-all">
                                        Edit Reservation
                                    </a>
                                    <a href={`/my-bookings/${order.reference}/download`}
                                        className="flex-1 md:w-40 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl text-center shadow-lg shadow-emerald-500/20 transition-all">
                                        Download PDF
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
