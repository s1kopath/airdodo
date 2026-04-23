import { router, Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';

const STATUS_COLORS = {
    pending:           'bg-amber-50 text-amber-600 border-amber-100',
    payment_submitted: 'bg-blue-50 text-blue-600 border-blue-100',
    approved:          'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected:          'bg-rose-50 text-rose-600 border-rose-100',
    cancelled:         'bg-slate-50 text-slate-400 border-slate-100',
};

function RejectModal({ order, onClose }) {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    function submit(e) {
        e.preventDefault();
        setLoading(true);
        router.post(`/admin/orders/${order.id}/reject`, { admin_note: note }, { onFinish: () => { setLoading(false); onClose(); } });
    }

    return (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-black text-navy mb-2 tracking-tight">Reject Reservation</h3>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Please provide a reason for rejecting order <span className="text-brand font-black font-mono">{order.reference}</span>.</p>
                <form onSubmit={submit} className="space-y-6">
                    <textarea
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-400 focus:bg-white rounded-2xl px-6 py-4 font-bold text-navy transition-all outline-none resize-none"
                        rows={4}
                        placeholder="Internal notes or feedback for user..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-navy hover:border-navy transition-all">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 disabled:opacity-50 transition-all">
                            {loading ? 'Processing...' : 'Reject Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminOrderDetail({ order, flash }) {
    const [rejectOpen, setRejectOpen] = useState(false);

    function approve() {
        if (!confirm(`Approve order ${order.reference}?`)) return;
        router.post(`/admin/orders/${order.id}/approve`);
    }

    const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    return (
        <AdminLayout title={`Reservation ${order.reference}`}>
            <Head title={`Admin | Order ${order.reference}`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4 flex-wrap">
                    <a href="/admin/orders" className="inline-flex items-center gap-2 text-slate-400 hover:text-navy text-[10px] font-black uppercase tracking-widest transition-colors mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back to List
                    </a>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status]}`}>
                        {order.status.replace('_', ' ')}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <a href={`/admin/orders/${order.id}/edit`} className="bg-white border-2 border-slate-100 text-slate-400 font-black px-6 py-3 rounded-xl hover:text-navy hover:border-navy transition-all text-xs uppercase tracking-widest">Edit Data</a>
                    {['pending', 'payment_submitted'].includes(order.status) && (
                        <>
                            <button onClick={approve} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs uppercase tracking-widest">Approve</button>
                            <button onClick={() => setRejectOpen(true)} className="bg-rose-500 hover:bg-rose-600 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-rose-500/20 transition-all text-xs uppercase tracking-widest">Reject</button>
                        </>
                    )}
                    {order.status === 'approved' && (
                        <a href={`/admin/orders/${order.id}/download`} className="bg-navy hover:bg-navy-light text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-navy/20 transition-all text-xs uppercase tracking-widest flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                             Itinerary PDF
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    {/* Passenger Table */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-black text-navy text-lg tracking-tight">Passenger Manifest</h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">{order.passengers?.length} Person(s)</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/20 border-b border-slate-50">
                                        {['Type', 'Full Name', 'Passport / Nationality', 'DOB'].map(h => (
                                            <th key={h} className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.passengers?.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-8 py-5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{p.type}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-black text-navy">{p.title ? `${p.title} ` : ''}{p.first_name} {p.last_name}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-mono font-bold text-navy text-xs">{p.passport_number || '—'}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{p.nationality}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-bold text-slate-500">{fmt(p.date_of_birth)}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Flight Details Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-shrink-0 text-center md:text-left">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center font-black text-brand text-2xl mb-4 mx-auto md:mx-0 shadow-inner">
                                {order.flight?.airline?.code}
                            </div>
                            <div className="font-black text-navy text-lg leading-tight">{order.flight?.airline?.name}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flight {order.flight?.flight_number}</div>
                        </div>
                        <div className="flex-1 flex items-center justify-between gap-8 w-full">
                            <div className="text-center md:text-left">
                                <div className="text-3xl font-black text-navy leading-none mb-1">{order.flight?.origin?.iata_code}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.flight?.origin?.city}</div>
                                <div className="text-brand font-black text-sm mt-3">{order.flight?.departure_time}</div>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2 opacity-30">
                                <div className="w-full h-0.5 bg-navy relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-navy">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <div className="text-3xl font-black text-navy leading-none mb-1">{order.flight?.destination?.iata_code}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.flight?.destination?.city}</div>
                                <div className="text-brand font-black text-sm mt-3">{order.flight?.arrival_time}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-navy rounded-[2.5rem] p-8 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
                        <div className="absolute right-[-10%] top-[-10%] opacity-5 rotate-12">
                             <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Reservation Summary</h4>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <span className="text-slate-400 font-bold text-sm">Payment Txn</span>
                                <span className="font-mono font-bold text-brand">{order.payment?.txn_id ?? '—'}</span>
                            </div>
                             <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <span className="text-slate-400 font-bold text-sm">Sender Number</span>
                                <span className="font-bold text-slate-200">{order.payment?.sender_number ?? '—'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Contact Record</h4>
                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Full Name</div>
                                <div className="font-black text-navy">{order.contact_name}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Email Address</div>
                                <div className="font-black text-navy truncate">{order.contact_email}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Phone Number</div>
                                <div className="font-black text-navy">{order.contact_phone || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {order.admin_note && (
                        <div className="bg-rose-50 rounded-[2rem] p-8 border border-rose-100">
                             <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Internal Note</div>
                             <p className="text-rose-700 font-bold text-sm leading-relaxed">{order.admin_note}</p>
                        </div>
                    )}
                </div>
            </div>

            {rejectOpen && <RejectModal order={order} onClose={() => setRejectOpen(false)} />}
        </AdminLayout>
    );
}
